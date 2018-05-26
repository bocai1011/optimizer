Vue.component('result-page', {
    template: '<div>\
        <div id="jsGrid"></div>\
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
                type: "POST",
                url: "/api/optimize/",
            }).done(function(result){
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
            width: "85%",
            height: "400px",

            filtering: false,
            inserting: false,
            editing: false,
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
                { name: "Weight", type: "text"},
                { name: "New weight", type: "text",},
                { name: "Buy weight", type: "text",},
                // { type: "control" }
            ]
        });

    },
    activated: function(){
        this.load_data();
    },
})