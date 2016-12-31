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



// d3.json('data/fake_users2.json', function(data) {
d3.json('data/example_data_json.json', function(data) {
    // for (var i = 0; i < data.length; i++) {
    //     data[i] = MG.convert.date(data[i], 'date');
    // }

    data = MG.convert.date(data, 'date');

    MG.data_graphic({
        title: "Brushing Addon by Dan De Havilland",
        description: "Drag the crosshair over the chart to zoom. For further details about this addon, take a look at its <a href='https://github.com/dandehavilland/mg-line-brushing'>GitHub repo</a>.",
        data: data,
        top: 70,
        width: 750,
        height: 275,
        right: 40,
        // missing_is_hidden: true,
        brushing: true,
        target: '#brushing',
        legend: ['Line 1','Line 2','Line 3'],
        legend_target: '.legend',
        x_accessor: 'date',
        y_accessor: ['1931', '1932', '1933']
    });
});




})
