/**
 * Created with JetBrains WebStorm.
 * User: jack
 * Date: 14-4-23
 * Time: 下午17:02
 * To change this template use File | Settings | File Templates.
 */


exports.list = function (req, res) {
    var callback = req.query.callback;
    var data = [
            {"age": "7-12", "num": (Math.random()*150).toFixed(2)},
            {"age": "13-18", "num": (Math.random()*150).toFixed(2)},
            {"age": "19-22", "num": (Math.random()*150).toFixed(2)},
            {"age": "23-25", "num": (Math.random()*100).toFixed(2)},
            {"age": "25-35","num": (Math.random()*100).toFixed(2)},
            {"age": "36-50", "num": (Math.random()*60).toFixed(2)},
            {"age": "50岁以上","num": (Math.random()*50).toFixed(2)},
            {"age": "未知","num": (Math.random()*50).toFixed(2)}
        ];
    res.send(callback+"("+JSON.stringify(data)+")");  
};

