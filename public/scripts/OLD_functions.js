        function makeSeriesVisible(series_name, series_array) {
            for (var i = 0; i < series_array.length; i++) {
                // CHANGE THE FOLLOWING TO A TERNARY FUNCTION
                if (series_array[i]['name']==series_name) {
                    series_array[i][series_name]=true;
                }
            }
            
            return series_array;
        }


        function makeSeriesInvisible(series_name, series_array) {
            for (var i = 0; i < series_array.length; i++) {
                // CHANGE THE FOLLOWING TO A TERNARY FUNCTION
                if (series_array[i]['name']==series_name) {
                    series_array[i][series_name]=false;
                }
            }
            return series_array;
        }