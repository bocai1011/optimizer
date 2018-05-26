Vue.component('load-page', {
    template: '\
        <div>\
            <div id="jsGrid"></div>\
            <div class="w3-margin-top">\
                <button class="w3-button w3-round w3-blue" @click="load_data">Load Data</button>\
                <button class="w3-button w3-round w3-blue" @click="update_data">Update</button>\
            </div>\
        </div>',
    data: function(){
        return {
            js_data: null,
        }
    },
    methods: {
        load_data: function(){
            var myVar = this;
            $.ajax({
                type: "GET",
                url: "/api/load_data",
            }).done(function(result) {
                myVar.js_data = result;
                $("#jsGrid").jsGrid("loadData", result);
            });
        },
        update_data: function(){
            var myVar = this;
            $.ajax({
                type: "POST",
                url: "/api/update_data/",
                data: {
                    js_data: JSON.stringify(myVar.js_data),
                },
            }).done(function(result){
                console.log(result);
            });
        },
    },
    mounted: function(){
        $("#jsGrid").jsGrid({
            width: "95%",
            height: "600px",

            filtering: false,
            inserting: true,
            editing: true,
            sorting: true,
            paging: true,
            autoload: true,

            pageSize: 10,
            pageButtonCount: 5,

            deleteConfirm: "Do you really want to delete client?",

            controller: {
                loadData: function(data){
                    return data;
                },
            },
            fields: [
                { name: "Name (BBG)", type: "text",},
                { name: "ISIN", type: "text",},
                { name: "Maturity Date", type: "text",},
                { name: "Exposure Country", type: "text",},
                { name: "Exposure Currency", type: "text",width:"65px"},
                { name: "Duration", type: "text",width:"65px"},
                { name: "Spread", type: "text",width:"65px"},
                { name: "Yield", type: "text",width:"65px"},
                { name: "MV%", type: "text",width:"65px"},
                { name: "Total MV", type: "text",},
                { type: "control" }
            ]
        });

    },
    activated: function(){
    },
})