$(document).ready(function () {
    // 服务器信息配置
    // 外网配置
    //var serverIP = "abstract.ibiter.org";
    //var serverPort = "80";
    // 内网配置
     var serverIP = "127.0.0.1";
     var serverPort = "8002";

    // 定义测试文本
    var textArray = [
        "我要先说你恭喜的话，应为我者到现在很难找到工作，所以很棒。",
        "今天我跟美美一起去看一前她要看的电影。",
        "令天突然冷了起来，妈妈丛相子里番出一件旧棉衣让我穿上。我不原意。在妈妈得说服叫育下，我中于穿上哪件棉衣哼着哥儿上学去了。 ",
        "这是一篇针砭时弊的文章，对当前产生的腐败现象产生的缘（（原））因分析的十分中肯。"
    ];

    $("#modifyBtn").hide();

    // 字符串格式化函数
    String.prototype.format = function () {
        var values = arguments;
        return this.replace(/\{(\d+)\}/g, function (match, index) {
            if (values.length > index) {
                return values[index];
            } else {
                return "";
            }
        });
    };

    // 自适应高度
    $('#text-input').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input focus', function () {
        var length = $("#text-input").val().length;
        $("#wordCountSpan").text(length.toString());
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    $('#text-output').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input focus', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // 清除文字按钮
    $("#clearTextBtn").click(function () {
        $("#text-input").val("");
        $("#text-input").focus();
    });


    // // 语言选择
    // $(".langSelect").click(function () {
    //     $("#lang").text($(this).text());
    // });

    // 测试文本选择
    $(".textSelect").click(function () {
        var textId = $(this).attr("id");  // text1
        var id_index = Number(textId.substr(4, 1));
        $("#text-input").val(textArray[id_index - 1]);
        $("#text-input").focus();   // 设置焦点触发textarea自适应函数
    });


    // function isChinese(str) {
    //     return /[^\x00-\xff]/g.test(str);
    // }

    // 点击对文本进行校对
    $("#correctBtn").click(function () {

        // var lang = $("#lang").text().trim();   // 语言选项
        var srcText = $("#text-input").val();   // 输入的文本内容

        // 判断是否为空
        if (!srcText) {
            // 处理内容为空
        } else {
            // // 检测语言类型
            // if (lang == "English") {
            //     lang = "Eng";
            // } else if (lang == "中文") {
            //     lang = "Zh"
            // } else {
            //     // 自动检测
            //     lang = isChinese(srcText) ? "Zh" : "Eng";
            //     $("#{0}".format(lang)).click();
            // }

            // 清空结果
            $("#modifyBtn").hide();
            $("#text-output").text("");

            // 设置按钮状态与等待loader
            $("#correctBtn").attr("disabled", true);    // 设置按钮不可用
            $("#correctBtn").tooltip('hide');            // 隐藏tooltips提示
            $("#correctBtn").attr("hidden", true);
            $("#loader").attr("hidden", false);

            // 发送ajax请求
            $.ajax({
                type: 'POST',
                url: "http://{0}:{1}/as_client".format(serverIP, serverPort),
                // url:'/as_client',
                dataType: 'json',
                data: {
                    src_text: srcText
                },
                success:function (response) {
                    console.log(response)
                    //返回校对结果
                    correctText2 = response.tar_text
                    console.log(correctText2)
                    var correctText = response['tar_text'].trim();
                    console.log(correctText)
                    correctText = "<span class='text-primary'>" + correctText + "</span>";
                    console.log(correctText)
                    // 纠正内容上传服务器
                    $("#modifyBtn").show();
                    $("#modifyBtn").attr("hidden", false);

                    $("#text-output").text("");
                    $("#text-output").append(correctText);        // 显示结果
                    $("#text-output").focus();
                },
                error:function (msg) {
                    
                }
            })
            $("#correctBtn").attr("disabled", false);    // 设置按钮可用
            $("#correctBtn").attr("hidden", false);
            $("#loader").attr("hidden", true);
        }
    });


    // 修改结果并上传服务器
    $("#modifyBtn").click(function () {
        var text = $("#modifyBtn").text();
        if (text == "修改建议") {
            $("#modifyBtn").text("保存修改");
            $("#text-output").attr("readonly", false);
            $("#text-output").attr("contenteditable", true);
        } else {
            $("#modifySuccess").toast("show");
            $("#modifyBtn").text("修改建议");
            $("#text-output").attr("contenteditable", false);
            $("#text-output").attr("readonly", true);
        }
    });


});
