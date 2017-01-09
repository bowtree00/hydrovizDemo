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
        data = MG.convert.date(data, 'Date');

        // ** SET UP THE HTML PAGE AND DATA STRUCTURES **
        // Get all of the series names from the data
        // Put them into an array, and create an array with the corresponding series numbers (e.g., 1, 2, 3...)
        // Create the appropriate number of buttons on the page - one for each series
        // Put the series names in the data-attributes for each button

        console.log("data", data);


        // Set x_accessor (x-axis) and series_list
        // NOTE: x_accessor is hard coded for now, but change it so the user can select which key is the x-axis
        var x_accessor = 'Date';
        var temp = Object.keys(data[0]);
        
        // console.log('temp', temp);

        // Remove the x_accessor value from the keys list
        var index = temp.indexOf(x_accessor);

        if (index > -1) {
            temp.splice(index, 1);
        }
        
        var series_list = [];

        for (var i = 0; i < temp.length; i++) {
            series_list[i]=parseInt(temp[i]);
        }

        console.log('series_list', series_list);



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

        // var y_accessor = ['min', 'tenth', 'median', 'ninetieth', 'max', 'mean'];


        var series_object = [
            {name: "min", order: 1, visible: true}, 
            {name: "tenth", order: 2, visible: true},
            {name: "mean", order: 3, visible: true},
            {name: "median", order: 4, visible: true},
            {name: "ninetieth", order: 5, visible: true},
            {name: "max", order: 6, visible: true},
            {name: "pick", order: 7, visible: false},
            ];

        var y_accessor = [];

        function getSeriesNames(series_object) {
            var names = [];
            
            for (var i = 0; i < series_object.length; i++) {
                console.log('series_object[i]["visible"]', series_object[i]["visible"]);

                if (series_object[i]["visible"]) {
                    names.push(series_object[i].name);
                }
            }

            return names;
        }

        function getSeriesOrders(series_object) {
            var orders = [];

            for (var i = 0; i < series_object.length; i++) {
                if (series_object[i]["visible"]) {
                    orders.push(series_object[i].order);
                }
            }

            return orders;
        }


        var y_accessor=getSeriesNames(series_object);
        console.log('y_accessor', y_accessor);

        var color_map=getSeriesOrders(series_object);
        console.log('color_map', color_map);




        // Create object to track all series and their order
        var y_order = {};
        var color_map = [];
        
        for (var i = 0; i < y_accessor.length; i++) {
            y_order[y_accessor[i]]=i+1;
            color_map[i]=i+1;
        }

        y_order_length=Object.keys(y_order).length;
        y_order['pick']=y_order_length+1;
        color_map.push(y_order_length+1);



        console.log('y_order', y_order);
        console.log('color_map', color_map);

        
        // CREATE BUTTONS
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
        for (var i = 0; i < series_list.length; i++) {
            $('#ddmenu').append(`<a class="dropdown-item" href="#" data-y_accessor="${series_list[i]}" id="${series_list[i]}">${series_list[i]}</a>`);
        }

        // Create a button for the 'Pick a year'
        $('.pickYearButtonContainer').append(`<button type="button" class="btn btn-outline-primary pickYearButton" data-pick_year="${series_list[0]}">${series_list[0]}</button>`);

        // set x_accessor and y_accessor in chart object
        multiple_with_brushing.x_accessor = x_accessor;
        multiple_with_brushing.y_accessor = y_accessor;
        multiple_with_brushing.legend = y_accessor;

        console.log(multiple_with_brushing);

        globals.data = data;
        
        // specify the max number of series (provides a bounds for the custom_line_color_map)
        multiple_with_brushing.max_data_size = y_accessor.length;

        multiple_with_brushing.data = data;
        MG.data_graphic(multiple_with_brushing);



        // ADD LISTENERS
        // NOTE listeners have to be added within this callback since is async

        // Create listeners for 'Pick Year' dropdown menu items
        for (var i = 0; i < y_accessor.length; i++) {

            $(`#${series_list[i]}`).click(function() {
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

            if (y_accessor.includes(buttonValue)) {
                // console.log("its here!")

                // console.log("y_accessor before", y_accessor);
                // console.log("color_map before", color_map);

                // Update y_accessor and color_map
                var index = y_accessor.indexOf(buttonValue);

                if (index > -1) {
                    y_accessor.splice(index, 1);
                    color_map.splice(index, 1);
                }
                
                // console.log("y_accessor after", y_accessor);
                // console.log("color_map after", color_map);

            } else {
                y_accessor.push(buttonValue);
                // console.log("y_accessor ADDED BACK", y_accessor);
                color_map.push(y_order[buttonValue]);
                // console.log("color_map ADDED BACK", color_map);
            }

            // NOTE: When adding/removing series, make sure to adjust the color map as well
            multiple_with_brushing.custom_line_color_map = color_map;
            multiple_with_brushing.y_accessor = y_accessor;
            multiple_with_brushing.legend = y_accessor;
            multiple_with_brushing.max_data_size = y_accessor.length;
            console.log("y_accessor after", y_accessor);
            console.log("color_map after", color_map);
            console.log("multiple_with_brushing.legend", multiple_with_brushing.legend)
            delete multiple_with_brushing.xax_format;
            MG.data_graphic(multiple_with_brushing);

        });


        $('.series-buttons button').click(function() {
            
            $(this).toggleClass('active');

            var selected_y_accessor = $(this).data('y_accessor');
            console.log('selected_y_accessor', selected_y_accessor);
            console.log('y_order @ selected', y_order[selected_y_accessor]);

            if (y_accessor.includes(selected_y_accessor)) {
                // console.log("its here!")

                // console.log("y_accessor before", y_accessor);
                // console.log("color_map before", color_map);

                // Update y_accessor and color_map
                var index = y_accessor.indexOf(selected_y_accessor);

                if (index > -1) {
                    y_accessor.splice(index, 1);
                }

                var index_y_order = color_map.indexOf(y_order[selected_y_accessor]);

                color_map.splice(index_y_order, 1);
                
                console.log("y_accessor REMOVED", y_accessor);
                console.log("color_map REMOVED", color_map);

            } else {
                y_accessor.push(selected_y_accessor);
                console.log("y_accessor ADDED BACK", y_accessor);
                color_map.push(y_order[selected_y_accessor]);
                console.log("color_map ADDED BACK", color_map);
            }

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



    // $('.split-by-controls button').click(function() {
    //     var new_y_accessor = $(this).data('y_accessor');

    //     console.log('HERE!');
    //     // create an array of objects to keep track of series names and their order
    //     // [ {
    //     //      name: "1932",
    //     //      order: 1
    //     //     },
    //     //     {
    //     //      name: "1933",
    //     //      order: 2
    //     //     } 
    //     //  ]
    //     // create a separate y_accessor array to keep track of which series to show/hide (since the y_accessor in the multiple_with_brushing object is a proprietary data format)
    //     // when button is pushed, check if the selected series is in the array - if it is, splice it out (and splice out the series number from the series array). If it's not, add it
    //     // 
    //     // Plot the new graph

    //     // multiple_with_brushing.y_accessor = ['1932','1933'];

    //     // NOTE: When adding/removing series, make sure to adjust the color map as well
    //     // multiple_with_brushing.custom_line_color_map = [2,3];

    //     // specify the max number of series (provides a bounds for the custom_line_color_map)
    //     // multiple_with_brushing.max_data_size = 3;



    //     // change button state
    //     // $(this).addClass('active').siblings().removeClass('active');

    //     $(this).toggleClass('active');

    //     // update data
    //     delete multiple_with_brushing.xax_format;
    //     MG.data_graphic(multiple_with_brushing);
    // });

})


