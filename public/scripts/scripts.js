$(function() {

    var globals = {};

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




    d3.json('data/example_6series_json.json', function(data) {
        
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

        data = MG.convert.date(data, 'Date');
        console.log("data", data);

        // SET X_ACCESSOR (x-axis) AND YEAR_SERIES_LIST
        // NOTE: x_accessor is hard coded for now, but change it so the user can select which key is the x-axis. This is also hard coded for all y-series as years - could make this generic so it's agnostic about what information the y-series represent
        // 
        var x_accessor = 'Date';
        var series_keys = Object.keys(data[0]);

        // Remove the x_accessor value from the keys list
        var index = series_keys.indexOf(x_accessor);

        if (index > -1) {
            series_keys.splice(index, 1);
        }
        
        var year_series_list = [];

        for (var i = 0; i < series_keys.length; i++) {
            year_series_list[i]=parseInt(series_keys[i]);
        }

        console.log('year_series_list', year_series_list);



        //SUMMARY STATS - add to the data object
        for (var i = 0; i < data.length; i++) {
            var tempArray = []; // Get values from each property of the object

            for(var key in data[i]) {

                // MUST UPDATE THIS CONDITIONAL - is hard-coded to ignore 'x_accessor' (i.e., 'Date'), but it should ignore either a) anything that is not a year (e.g., 1932) or a key, or b) whatever is selected as the x-axis (e.g., if the key 'XYZ' is selected as the x-axis, ignore it)

                if (key!==x_accessor) {
                    tempArray.push(data[i][key]);
                }   
            }
            // console.log('tempArray', tempArray);

            data[i].min = ss.min(tempArray);
            data[i].tenth = ss.quantile(tempArray, 0.1);
            data[i].median = ss.quantile(tempArray, 0.5);
            data[i].ninetieth = ss.quantile(tempArray, 0.9);
            data[i].max = ss.max(tempArray);
            data[i].mean = ss.mean(tempArray);

        }

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
        multiple_with_brushing.x_accessor = x_accessor;
        multiple_with_brushing.y_accessor = y_accessor;
        multiple_with_brushing.legend = y_accessor;
        // specify the max number of series (provides a bounds for the custom_line_color_map)
        multiple_with_brushing.max_data_size = y_accessor.length;

        console.log("multiple_with_brushing AT START",multiple_with_brushing);
        console.log("multiple_with_brushing.y_accessor",multiple_with_brushing.y_accessor);
        globals.data = data;  // DO I NEED THIS?
        
        multiple_with_brushing.data = data;
        MG.data_graphic(multiple_with_brushing);


        // CREATE BUTTONS
        // 
        // for (var i = 0; i < y_accessor.length; i++) {
        //     $('.series-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="${y_accessor[i]}">${y_accessor[i]}</button>`);
        // }

        $('.series-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="max">Max</button>`);
        $('.series-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="ninetieth">90th</button>`);
        $('.series-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="median">50th</button>`);
        $('.series-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="mean">Mean</button>`);
        $('.series-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="tenth">10th</button>`);
        $('.series-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="min">Min</button>`);


        // CREATE DROPDOWN ITEMS
        // 
        for (var i = 0; i < year_series_list.length; i++) {
            $('#ddmenu').append(`<a class="dropdown-item" href="#" data-y_accessor="${year_series_list[i]}" id="${year_series_list[i]}">${year_series_list[i]}</a>`);
        }

        // Create a button for the 'Pick a year'
        $('.pickYearButtonContainer').append(`<button type="button" class="btn btn-outline-primary pickYearButton" data-pick_year="${year_series_list[0]}">${year_series_list[0]}</button>`);

        // ADD LISTENERS
        //
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
            multiple_with_brushing.custom_line_color_map = color_map;
            multiple_with_brushing.y_accessor = y_accessor;
            multiple_with_brushing.legend = y_accessor;
            multiple_with_brushing.max_data_size = y_accessor.length;

            console.log("multiple_with_brushing", multiple_with_brushing)
            console.log("multiple_with_brushing.y_accessor",multiple_with_brushing.y_accessor);
            console.log("multiple_with_brushing.legend",multiple_with_brushing.legend);
            console.log("multiple_with_brushing.max_data_size",multiple_with_brushing.max_data_size);

            delete multiple_with_brushing.xax_format;
            MG.data_graphic(multiple_with_brushing);
        });


        $('.series-buttons button').click(function() {
           
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
            multiple_with_brushing.custom_line_color_map = color_map;
            multiple_with_brushing.y_accessor = y_accessor;
            multiple_with_brushing.legend = y_accessor;
            multiple_with_brushing.max_data_size = y_accessor.length;

            // console.log("y_accessor after", y_accessor);
            // console.log("color_map after", color_map);
            console.log("multiple_with_brushing.legend", multiple_with_brushing.legend)
            delete multiple_with_brushing.xax_format;
            MG.data_graphic(multiple_with_brushing);
            
        });
        console.log("data", data);
    });


})


