Vue.component('optimize-page', {
    template: '<div style="width:80%">\
        <div class="w3-card" id="jsGrid"></div>\
        <div class="w3-margin-top" style="display:flex;justify-content:flex-end">\
            <button class="w3-btn w3-blue" style="text-shadow:1px 1px 0 #444; margin:2px" @click="update_data">Change</button>\
            <button class="w3-btn w3-blue" style="text-shadow:1px 1px 0 #444; margin:2px" @click="optimize">Optimize</button>\
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
            $.ajax({
                type: "POST",
                url: "/api/optimize/",
            }).done(function(result){
                console.log(result);
            });
        },
    },
    mounted: function(){
        $("#jsGrid").jsGrid({
            width: "100%",
            height: "400px",

            filtering: false,
            inserting: false,
            editing: true,
            sorting: false,
            paging: false,
            autoload: false,

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