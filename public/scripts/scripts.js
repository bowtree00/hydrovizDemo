$(function() {

// d3.json('./data/ufo-sightings.json', function(data) {
// })

// d3.json('./data/ufo-sightings.json', function(data) {
//     MG.data_graphic({
//         title: "UFO Sightings",
//         description: "Yearly UFO sightings from the year 1945 to 2010.",
//         data: data,
//         width: 750,
//         height: 270,
//         target: '#ufo-sightings',
//         x_accessor: 'year',
//         y_accessor: 'sightings',
//         markers: [{'year': 1964, 'label': '"The Creeping Terror" released'}],
//         y_rug: true
//     })
// })


// MG._hooks = {};

// // d3.json('data/fake_users2.json', function(data) {
// d3.json('data/example_data_json.json', function(data) {
//     // for (var i = 0; i < data.length; i++) {
//     //     data[i] = MG.convert.date(data[i], 'date');
//     // }

//     data = MG.convert.date(data, 'date');

//     MG.data_graphic({
//         title: "Multi-Line Chart",
//         description: "This line chart contains multiple lines.",
//         data: data,
//         width: 750,
//         height: 275,
//         right: 40,
//         target: '#fake_users2',
//         // legend: ['Line 1','Line 2','Line 3'],
//         // legend_target: '.legend',
//         x_accessor: 'date',
//         y_accessor: ['1931', '1932', '1933']
//     });
// });


// WORKING 3-Series chart
// 
// // d3.json('data/fake_users2.json', function(data) {
// d3.json('data/example_data_json.json', function(data) {
//     // for (var i = 0; i < data.length; i++) {
//     //     data[i] = MG.convert.date(data[i], 'date');
//     // }

//     data = MG.convert.date(data, 'date');

//     MG.data_graphic({
//         title: "Brushing Addon by Dan De Havilland",
//         description: "Drag the crosshair over the chart to zoom. For further details about this addon, take a look at its <a href='https://github.com/dandehavilland/mg-line-brushing'>GitHub repo</a>.",
//         data: data,
//         top: 70,
//         width: 750,
//         height: 275,
//         right: 40,
//         // missing_is_hidden: true,
//         brushing: true,
//         target: '#brushing',
//         legend: ['Line 1','Line 2','Line 3'],
//         legend_target: '.legend',
//         x_accessor: 'date',
//         y_accessor: ['1931', '1932', '1933']
//     });
// });



var globals = {};

var multiple_with_brushing = {
    title: "Brushing Addon by Dan De Havilland",
    description: "Drag the crosshair over the chart to zoom. For further details about this addon, take a look at its <a href='https://github.com/dandehavilland/mg-line-brushing'>GitHub repo</a>.",
    // data: data,
    top: 70,
    width: 750,
    height: 275,
    right: 40,
    // missing_is_hidden: true,
    brushing: true,
    // brushing_history: true,
    target: '#brushing',
    legend: ['Line 1','Line 2','Line 3'],
    legend_target: '.legend',
    x_accessor: 'date',
    y_accessor: ['1931', '1932', '1933'],
    show_secondary_x_label: false,
    transition_on_update: false
};


// d3.json('data/fake_users2.json', function(data) {
d3.json('data/example_data_json.json', function(data) {
    data = MG.convert.date(data, 'date');
    globals.data = data;
    
    multiple_with_brushing.data = data;
    MG.data_graphic(multiple_with_brushing);
 
});


$('.split-by-controls button').click(function() {
    var new_y_accessor = $(this).data('y_accessor');
    // multiple_with_brushing.y_accessor = new_y_accessor;

    // var old_y_accessor = [multiple_with_brushing.y_accessor];
    // console.log("old_y_accessor", old_y_accessor)

    // var new_y_accessor = [multiple_with_brushing.y_accessor];
    // console.log("new_y_accessor", new_y_accessor)

    // var concat_y_accessor = old_y_accessor.push(new_y_accessor);
    // console.log('concat_y_accessor', concat_y_accessor);

    multiple_with_brushing.y_accessor = ['1932','1933'];

    // NOTE: When adding/removing series, make sure to adjust the color map as well
    multiple_with_brushing.custom_line_color_map = [2,3];

    // specify the max number of series (provides a bounds for the custom_line_color_map)
    multiple_with_brushing.max_data_size = 3;



    // change button state
    // $(this).addClass('active').siblings().removeClass('active');

    $(this).toggleClass('active');

    // update data
    delete multiple_with_brushing.xax_format;
    MG.data_graphic(multiple_with_brushing);
});




})

