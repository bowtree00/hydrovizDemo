$(function() {

    var multiple_with_brushing = {
        title: "BC Hydro Unspecified Dam Flow Data",
        description: "Drag the crosshair over the chart to zoom. For further details about this addon, take a look at its <a href='https://github.com/dandehavilland/mg-line-brushing'>GitHub repo</a>.",
        // data: data,
        top: 70,
        width: 750,
        height: 325,
        right: 40,
        // missing_is_hidden: true,
        brushing: true,
        // brushing_history: true,
        target: '#chart-area',
        // legend: ['Line 1','Line 2','Line 3'],
        legend_target: '.legend',
        // x_accessor: 'Date',
        // y_accessor: ['1931', '1932', '1933', '1934', '1935', '1936'],
        show_secondary_x_label: false,
        transition_on_update: false
    };

    // const guy = {
    //   name: 'Richard',
    //   age: 28
    // }

    // const newGuy = Object.assign({}, guy, {
    //   age: 30
    // })

    var TEST_INCREMENTER = 1;
    var TEST_INCREMENTER_STATS = 1;

    console.log('multiple_with_brushing JUST DECLARED', multiple_with_brushing);

    function getSeriesNames(series_array) {
        var names = [];
        
        for (var i = 0; i < series_array.length; i++) {
            // console.log('series_array[i]["visible"]', series_array[i]["visible"]);

            if (series_array[i]["visible"]) {
                names.push(series_array[i].name);
            }
        }

        return names;
    }

   function getSeriesOrders(series_array) {
        var orders = [];

        for (var i = 0; i < series_array.length; i++) {
            if (series_array[i]["visible"]) {
                orders.push(series_array[i].order);
            }
        }
        return orders;
    }

    function toggleSeriesVisibility(series_name, series_array) {
        for (var i = 0; i < series_array.length; i++) {
            // console.log('series_array[i] BEFORE', series_array[i]);

            if (series_array[i]['name']==series_name) {
                console.log(`Found ${series_name}`)
                if (series_array[i]['visible']==true){
                    series_array[i]['visible']=false;
                } else {
                 series_array[i]['visible']=true;
                }   
            }
            // console.log('series_array[i] AFTER', series_array[i]);
        }
        
        return series_array;
    }

    function getYearSeriesList(dataObject, x_accessor) {

        var series_keys = Object.keys(dataObject);

        // Remove the x_accessor value from the keys list
        var index = series_keys.indexOf(x_accessor);

        if (index > -1) {
            series_keys.splice(index, 1);
        }
        
        var year_series_list = [];

        for (var i = 0; i < series_keys.length; i++) {
            year_series_list[i]=parseInt(series_keys[i]);
        }
        
        return year_series_list;
    }

    function calcSummaryStats(dataArray, x_accessor) {
        // dataArray is an array of objects

        var dataCopy = [];
        
        // Make a copy of the data array without mutating data
        for (var i = 0; i < dataArray.length; i++) {
            dataCopy[i]=Object.assign({}, dataArray[i]);
        }

        //SUMMARY STATS - add to the data object
        // 
        for (var i = 0; i < dataCopy.length; i++) {
            var tempArray = []; // Get values from each property of the object

            for(var key in dataCopy[i]) {
                // MUST UPDATE THIS CONDITIONAL - is hard-coded to ignore 'x_accessor' (i.e., 'Date'), but it should ignore either a) anything that is not a year (e.g., 1932) or a key, or b) whatever is selected as the x-axis (e.g., if the key 'XYZ' is selected as the x-axis, ignore it)

                if (key!==x_accessor) {
                    tempArray.push(dataCopy[i][key]);
                }   
            }

            // dataCopy[i].min = ss.min(tempArray);
            // dataCopy[i].tenth = ss.quantile(tempArray, 0.1);
            // dataCopy[i].median = ss.quantile(tempArray, 0.5);
            // dataCopy[i].ninetieth = ss.quantile(tempArray, 0.9);
            // dataCopy[i].max = ss.max(tempArray);
            // dataCopy[i].mean = ss.mean(tempArray);

            dataCopy[i]['min'] = ss.min(tempArray);
            dataCopy[i]['tenth'] = ss.quantile(tempArray, 0.1);
            dataCopy[i]['median'] = ss.quantile(tempArray, 0.5);
            dataCopy[i]['ninetieth'] = ss.quantile(tempArray, 0.9);
            dataCopy[i]['max'] = ss.max(tempArray);
            dataCopy[i]['mean'] = ss.mean(tempArray);
        }

        return dataCopy;
    }

    var alternatives = [
        {
            name: 'Alternative 1',
            id: 'Alt1',
            filename:'data/location1_alt1_JSON.json'
        }, 
        {
            name: 'Alternative 2',
            id: 'Alt2',
            filename: 'data/location1_alt2_JSON.json'
        }, 
        {
            name: 'Alternative 3',
            id: 'Alt3',
            filename: 'data/location1_alt3_JSON.json'
        }
        ];

    var currentFilename = alternatives[0]['filename'];

    // var filenames = {
    //     'data/location1_alt1_JSON.json', 'data/location1_alt2_JSON.json', 'data/location1_alt3_JSON.json'];


    // Dropdown for 'Pick Alternative'
    for (var i = 0; i < alternatives.length; i++) {
        $('#pickAltMenu').append(`<a class="dropdown-item" href="#" data-y_accessor="${alternatives[i]['filename']}" id="${alternatives[i]['id']}">${alternatives[i]['name']}</a>`);
    }

    // Create listeners for 'Pick Alternative' dropdown menu items
    
    for (var i = 0; i < alternatives.length; i++) {
        $(`#${alternatives[i]["id"]}`).click(function() {
            var selectedText = $(this).text();
            var selectedFilename = $(this).data('y_accessor');

            console.log('selectedText', selectedText);

            // Add the selected year to the pickYearButton
            $('.altSelectedMessage').text(selectedText);

        })
    }


    // d3.json('data/example_6series_json.json', function(data) {
    d3.json(currentFilename, function(data) {
   
        console.log("data @ START", data);

        data = MG.convert.date(data, 'Date');

        var x_accessor = 'Date';
        // NOTE: x_accessor is hard coded for now, but change it so the user can select which key is the x-axis. This is also hard coded for all y-series as years - could make this generic so it's agnostic about what information the y-series represent
        // 
        year_series_list = getYearSeriesList(data[0], x_accessor);

        dataWithStats = calcSummaryStats(data, x_accessor);

        console.log('dataWithStats', dataWithStats);

        // CREATE SERIES OBJECT TO TRACK WHAT SERIES ARE PLOTTED
        var series_array = [
            {name: "min", order: 1, visible: true}, 
            {name: "tenth", order: 2, visible: true},
            {name: "mean", order: 3, visible: true},
            {name: "median", order: 4, visible: true},
            {name: "ninetieth", order: 5, visible: true},
            {name: "max", order: 6, visible: true},
            {name: "1931", order: 7, visible: false},
            ];

        // NOTE for the 'pick year' I'm initializing as 1931, but this should be dynamically initialized depending on the data set
        // 
        
        // CREATE AND INITIALIZE Y_ACCESSOR
        var y_accessor = [];

        var y_accessor=getSeriesNames(series_array);
        console.log('y_accessor AT START', y_accessor);

        var color_map=getSeriesOrders(series_array);
        console.log('color_map AT START', color_map);

        // RENDER CHART ON LOAD
        // 
        // set x_accessor and y_accessor in chart object
        // multiple_with_brushing.x_accessor = x_accessor;
        // multiple_with_brushing.y_accessor = y_accessor;
        // multiple_with_brushing.legend = y_accessor;
        // multiple_with_brushing.custom_line_color_map = color_map;
        // multiple_with_brushing.max_data_size = y_accessor.length;

        newChart = Object.assign({}, multiple_with_brushing, {
            x_accessor: x_accessor,
            y_accessor: y_accessor,
            legend: y_accessor,
            custom_line_color_map: color_map,
            max_data_size: y_accessor.length, 
            data: dataWithStats
        })

        // TEST_INCREMENTER += 1;

        console.log("newChart.y_accessor",newChart.y_accessor);
        
        console.log("newChart.data",newChart.data);

        // multiple_with_brushing.data = data;

        // console.log("multiple_with_brushing.data START - AFTER",multiple_with_brushing.data);

        MG.data_graphic(newChart);


        // CREATE BUTTONS
        //
        $('.stats-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="max">Max</button>`);
        $('.stats-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="ninetieth">90th</button>`);
        $('.stats-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="median">50th</button>`);
        $('.stats-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="mean">Mean</button>`);
        $('.stats-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="tenth">10th</button>`);
        $('.stats-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="min">Min</button>`);
        // 
        // for (var i = 0; i < y_accessor.length; i++) {
        //     $('.stats-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="${y_accessor[i]}">${y_accessor[i]}</button>`);
        // }


        // CREATE DROPDOWN ITEMS


        // Dropdown for 'Pick Year'
        for (var i = 0; i < year_series_list.length; i++) {
            $('#pickYearMenu').append(`<a class="dropdown-item" href="#" data-y_accessor="${year_series_list[i]}" id="${year_series_list[i]}">${year_series_list[i]}</a>`);
        }


        // Create a button for the 'Pick a year'
        $('.pickYearButtonContainer').append(`<button type="button" class="btn btn-outline-primary pickYearButton" data-pick_year="${year_series_list[0]}">${year_series_list[0]}</button>`);


        // CHANGE 'DATA' IN ALL OF THE FOLLOWING TO 'dataWithStats'!!!!

        // ADD LISTENERS


        // Create listeners for 'Pick Year' dropdown menu items
        for (var i = 0; i < y_accessor.length; i++) {

            $(`#${year_series_list[i]}`).click(function() {
                // e.preventDefault(); // necessary?

                var selectedText = $(this).text();

                console.log('selectedText', selectedText);

                // Add the selected year to the pickYearButton
                $('.pickYearButton').text(selectedText);
                $('.pickYearButton').data('pick_year', selectedText);

            });
        }

        $('.pickYearButton').click(function(){
            $(this).toggleClass('active');

            var buttonValue = $('.pickYearButton').text();
            console.log("buttonValue", buttonValue);

            console.log("y_accessor before", y_accessor);
            console.log("color_map before", color_map);

            // console.log("series_array BEFORE click", series_array);
            series_array=toggleSeriesVisibility(buttonValue, series_array);
            // console.log("series_array AFTER click", series_array);

            y_accessor=getSeriesNames(series_array);
            color_map=getSeriesOrders(series_array);
            console.log("y_accessor after", y_accessor);
            console.log("color_map after", color_map);

            // NOTE: When adding/removing series, make sure to adjust the color map as well


            var newChart_PickYear = Object.assign({}, multiple_with_brushing, {
                x_accessor: x_accessor,
                y_accessor: y_accessor,
                legend: y_accessor,
                custom_line_color_map: color_map,
                max_data_size: y_accessor.length, 
                data: dataWithStats,
                title: `INCREMENT:${TEST_INCREMENTER}`
            })

            TEST_INCREMENTER += 1;

            // multiple_with_brushing.custom_line_color_map = color_map;
            // multiple_with_brushing.y_accessor = y_accessor;
            // multiple_with_brushing.legend = y_accessor;
            // multiple_with_brushing.max_data_size = y_accessor.length;

            console.log("newChart_PickYear", newChart_PickYear)
            console.log("newChart_PickYear.y_accessor",newChart_PickYear.y_accessor);
            console.log("newChart_PickYear.legend PICKYEAR",newChart_PickYear.legend);
            console.log("newChart_PickYear.max_data_size PICKYEAR",newChart_PickYear.max_data_size);
            console.log("newChart_PickYear.data PICKYEAR",newChart_PickYear.data);
            delete newChart_PickYear.xax_format;
            MG.data_graphic(newChart_PickYear);
            // delete newChart_PickYear;
            newChart_PickYear = {};
            console.log('newChart_PickYear AFTER DELETE', newChart_PickYear);
            
        });


        $('.stats-buttons button').click(function() {
           
            $(this).toggleClass('active');

            var selected_y_accessor = $(this).data('y_accessor');
            console.log('selected_y_accessor', selected_y_accessor);

            console.log("y_accessor before", y_accessor);
            console.log("color_map before", color_map);

            console.log("series_array BEFORE click", series_array);

            series_array=toggleSeriesVisibility(selected_y_accessor, series_array);

            console.log("series_array AFTER click", series_array);


            y_accessor=getSeriesNames(series_array);
            color_map=getSeriesOrders(series_array);
            console.log("y_accessor after", y_accessor);
            console.log("color_map after", color_map);



            // NOTE: When adding/removing series, make sure to adjust the color map as well
            // multiple_with_brushing.custom_line_color_map = color_map;
            // multiple_with_brushing.y_accessor = y_accessor;
            // multiple_with_brushing.legend = y_accessor;
            // multiple_with_brushing.max_data_size = y_accessor.length;

            var newChart_Stats = Object.assign({}, multiple_with_brushing, {
                x_accessor: x_accessor,
                y_accessor: y_accessor,
                legend: y_accessor,
                custom_line_color_map: color_map,
                max_data_size: y_accessor.length, 
                data: dataWithStats,
                title: `STATS INCREMENT:${TEST_INCREMENTER_STATS}`
            })

            TEST_INCREMENTER_STATS += 1;

            console.log("newChart_Stats", newChart_Stats)
            console.log("newChart_Stats.y_accessor",newChart_Stats.y_accessor);
            console.log("newChart_Stats.legend",newChart_Stats.legend);
            console.log("newChart_Stats.max_data_size",newChart_Stats.max_data_size);
            console.log("newChart_Stats.data",newChart_Stats.data);

            delete newChart_Stats.xax_format;
            MG.data_graphic(newChart_Stats);
            // delete newChart_Stats;
            newChart_Stats = {};
            console.log('newChart_Stats AFTER DELETE', newChart_Stats);           
        });

        console.log("data @ END", data);
    });

})


