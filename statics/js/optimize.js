Vue.component('optimize-page', {
    template: '<div>\
        <div id="jsGrid"></div>\
        <button class="w3-button w3-round w3-blue" @click="update_data">Update</button>\
        <button class="w3-button w3-round w3-blue" @click="optimize">Optimize</button>\
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
                url: "/api/load_agg",
            }).done(function(result) {
                myVar.js_data = result;
                $("#jsGrid").jsGrid("loadData", result);
            });
        },
        update_data: function(){
            var myVar = this;
            $.ajax({
                type: "POST",
                url: "/api/update_agg/",
                data: {
                    js_data: JSON.stringify(myVar.js_data),
                },
            }).done(function(result){
                console.log(result);
            });
        },
        optimize: function(){
            var myVar = this;
            $.ajax({
                type: "POST",
                url: "/api/optimize/",
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
            width: "80%",
            height: "400px",

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
                { name: "Column", type: "text",},
                { name: "Portfolio", type: "text",},
                { name: "Max", type: "text",},
                { name: "Min", type: "text",},
                { name: "Constraint", type: "checkbox",},
                { type: "control" }
            ]
        });

    },
    activated: function(){
        this.load_data();
    },
})