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

    // CREATE SERIES OBJECT TO TRACK WHAT SERIES ARE PLOTTED
    // 
    // NOTE for the 'pick year' I'm initializing as 1931, but this should be dynamically initialized depending on the data set
    // 
    var series_array = [
        {name: "min", order: 1, visible: true}, 
        {name: "tenth", order: 2, visible: true},
        {name: "mean", order: 3, visible: true},
        {name: "median", order: 4, visible: true},
        {name: "ninetieth", order: 5, visible: true},
        {name: "max", order: 6, visible: true},
        {name: "pickYear", order: 7, visible: false, year: '1900'}
        ];

    function getSeriesNames(series_array) {
        var names = [];
        
        for (var i = 0; i < series_array.length; i++) {
            // console.log('series_array[i]["visible"]', series_array[i]["visible"]);

            if (series_array[i]["visible"]) {
                if (series_array[i]['name']=='pickYear') {
                    // names.push(`Year:${series_array[i].year}`);
                    names.push(series_array[i].year);
                } else {
                    names.push(series_array[i].name);
                }
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
            console.log('series_array[i] BEFORE', series_array[i]);

            if (series_array[i]['name']==series_name) {
                console.log(`Found ${series_name}`)
                if (series_array[i]['visible']==true){
                    series_array[i]['visible']=false;
                } else {
                 series_array[i]['visible']=true;
                }   
            }
            console.log('series_array[i] AFTER', series_array[i]);
        }
        
        return series_array;
    }

    function changeYear(newYear, series_array) {
        for (var i = 0; i < series_array.length; i++) {
            if (series_array[i]['name']=='pickYear') {
                series_array[i]['year']=newYear
            }
        }
        console.log('YEAR CHANGED', series_array)
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


    // Create stats buttons
    $('.stats-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="max">Max</button>`);
    $('.stats-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="ninetieth">90th</button>`);
    $('.stats-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="median">50th</button>`);
    $('.stats-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="mean">Mean</button>`);
    $('.stats-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="tenth">10th</button>`);
    $('.stats-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="min">Min</button>`);

    // Dropdown button for 'Pick Alternative'
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
            $('.alt-selected-message').text(selectedText);

            // Replot when switching alternatives
            d3.json(selectedFilename, plotData);
        })
    }

    // Sets to the first alternative for the first iteration
    var currentFilename = alternatives[0]['filename'];
    $('.alt-selected-message').text(alternatives[0]['name']);

   
    var x_accessor = 'Date';


    // DEFINE BUTTONS AND BEHAVIOURS
    d3.json(currentFilename, function(data) {
        
        console.log('***** INITIALIZING BUTTONS *****')
        var year_series_list = getYearSeriesList(data[0], x_accessor);
        // NOTE: x_accessor is hard coded for now, but change it so the user can select which key is the x-axis. This is also hard coded for all y-series as years - could make this generic so it's agnostic about what information the y-series represent
        // 
        // on initialize, change year to first year in the series
        changeYear(`${year_series_list[0]}`, series_array);
        
        // CREATE DROPDOWN ITEMS
        // Create 'Pick Year' dropdown
        for (var i = 0; i < year_series_list.length; i++) {
            $('#pickYearMenu').append(`<a class="dropdown-item" href="#" data-y_accessor="${year_series_list[i]}" id="${year_series_list[i]}">${year_series_list[i]}</a>`);
        }

        // Create a 'Pick a year' toggle button
        $('.pickYearButtonContainer').append(`<button type="button" class="btn btn-outline-primary pickYearButton" data-pick_year="${year_series_list[0]}">${year_series_list[0]}</button>`);


        // // CREATE AND INITIALIZE Y_ACCESSOR
        // var y_accessor = [];

        // var y_accessor=getSeriesNames(series_array);
        // console.log('y_accessor TEST *********', y_accessor);

        // var color_map=getSeriesOrders(series_array);
        // console.log('color_map TEST *********', color_map);



        // LISTENERS for 'Pick Year' dropdown menu items
        for (var i = 0; i < year_series_list.length; i++) {

            $(`#${year_series_list[i]}`).click(function() {

                var selectedText = $(this).text();

                console.log('selectedText', selectedText);

                // Add the selected year to the pickYearButton
                $('.pickYearButton').text(selectedText);
                $('.pickYearButton').data('pick_year', selectedText);

                // Change year in series_array
                changeYear(selectedText, series_array);

                // if pick year button is toggled ON, then redraw chart with new year series
                for (var i = 0; i < series_array.length; i++) {
                    if (series_array[i]['name']=='pickYear') {
                        if (series_array[i]['visible']==true) {
                            d3.json(currentFilename, plotData);
                        }
                    }
                }

            });
        }

        // LISTENER FOR pickYearButton
        $('.pickYearButton').click(function(){
            $(this).toggleClass('active');

            // var buttonValue = $('.pickYearButton').text();
            // series_array=toggleSeriesVisibility(buttonValue, series_array);
            
            series_array=toggleSeriesVisibility('pickYear', series_array);
            
            d3.json(currentFilename, plotData);

        });

        // LISTENER FOR stats-buttons
        $('.stats-buttons button').click(function() {
           
            $(this).toggleClass('active');

            var selected_y_accessor = $(this).data('y_accessor');
            console.log('selected_y_accessor', selected_y_accessor);

            series_array=toggleSeriesVisibility(selected_y_accessor, series_array);

            d3.json(currentFilename, plotData);

        });

    });



    // MAIN FUNCTION TO PLOT THE CHART
    var plotData = function(data) {
   
        data = MG.convert.date(data, 'Date');

        dataWithStats = calcSummaryStats(data, x_accessor);
        
        // CREATE AND INITIALIZE Y_ACCESSOR
        var y_accessor = [];

        var y_accessor=getSeriesNames(series_array);
        console.log('y_accessor AT START', y_accessor);

        var color_map=getSeriesOrders(series_array);
        console.log('color_map AT START', color_map);

        newChart = Object.assign({}, multiple_with_brushing, {
            x_accessor: x_accessor,
            y_accessor: y_accessor,
            legend: y_accessor,
            custom_line_color_map: color_map,
            max_data_size: y_accessor.length, 
            data: dataWithStats
        })

        console.log("newChart.y_accessor",newChart.y_accessor);
        
        delete newChart.xax_format;
        MG.data_graphic(newChart);

    }


    d3.json(currentFilename, plotData);

})


