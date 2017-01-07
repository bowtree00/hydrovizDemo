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


        // Set x_accessor and y_accessor
        var x_accessor = 'Date';
        var temp = Object.keys(data[0]);
        
        console.log('temp', temp);

        // Remove the x_accessor value from the y_accessor
        var index = temp.indexOf(x_accessor);

        if (index > -1) {
            temp.splice(index, 1);
        }
        
        var y_accessor = [];

        for (var i = 0; i < temp.length; i++) {
            y_accessor[i]=parseInt(temp[i]);
        }

        console.log('y_accessor', y_accessor);


        // Create object to track all series and their order
        var y_order = {};
        var color_map = [];
        
        for (var i = 0; i < y_accessor.length; i++) {
            y_order[y_accessor[i]]=i+1;
            color_map[i]=i+1;
        }

        console.log('y_order', y_order);

        
        // CREATE BUTTONS
        for (var i = 0; i < y_accessor.length; i++) {
            $('.series-buttons').append(`<button type="button" class="btn btn-outline-primary active" data-y_accessor="${y_accessor[i]}">${y_accessor[i]}</button>`);
        }

        // CREATE DROPDOWN ITEMS
        for (var i = 0; i < y_accessor.length; i++) {
            $('#ddmenu').append(`<a class="dropdown-item" href="#" data-y_accessor="${y_accessor[i]}" id="${y_accessor[i]}">${y_accessor[i]}</a>`);
        }

        // Create a button for the 'Pick a year'
        $('.pickYearButtonContainer').append(`<button type="button" class="btn btn-outline-primary pickYearButton" data-pick_year="${y_accessor[0]}">${y_accessor[0]}</button>`);

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

            $(`#${y_accessor[i]}`).click(function() {
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
            console.log("HERE")

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
            // console.log("y_accessor after", y_accessor);
            // console.log("color_map after", color_map);
            console.log("multiple_with_brushing.legend", multiple_with_brushing.legend)
            // delete multiple_with_brushing.xax_format;
            MG.data_graphic(multiple_with_brushing);

        });


        $('.series-buttons button').click(function() {
            
            $(this).toggleClass('active');

            var selected_y_accessor = $(this).data('y_accessor');
            console.log('selected_y_accessor', selected_y_accessor);

            if (y_accessor.includes(selected_y_accessor)) {
                // console.log("its here!")

                // console.log("y_accessor before", y_accessor);
                // console.log("color_map before", color_map);

                // Update y_accessor and color_map
                var index = y_accessor.indexOf(selected_y_accessor);

                if (index > -1) {
                    y_accessor.splice(index, 1);
                    color_map.splice(index, 1);
                }
                
                // console.log("y_accessor after", y_accessor);
                // console.log("color_map after", color_map);

            } else {
                y_accessor.push(selected_y_accessor);
                // console.log("y_accessor ADDED BACK", y_accessor);
                color_map.push(y_order[selected_y_accessor]);
                // console.log("color_map ADDED BACK", color_map);
            }

            // NOTE: When adding/removing series, make sure to adjust the color map as well
            multiple_with_brushing.custom_line_color_map = color_map;
            multiple_with_brushing.y_accessor = y_accessor;
            multiple_with_brushing.legend = y_accessor;
            // console.log("y_accessor after", y_accessor);
            // console.log("color_map after", color_map);
            console.log("multiple_with_brushing.legend", multiple_with_brushing.legend)
            // delete multiple_with_brushing.xax_format;
            MG.data_graphic(multiple_with_brushing);
            
        });
        
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


