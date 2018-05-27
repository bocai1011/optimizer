Vue.component('load-page', {
    template: '\
        <div>\
            <div class="w3-card" id="jsGrid"></div>\
            <div class="w3-margin-top" style="display:flex;justify-content:flex-end">\
                <button class="w3-btn w3-blue" style="text-shadow:1px 1px 0 #444; margin:2px" @click="load_data">Load</button>\
                <button class="w3-btn w3-blue" style="text-shadow:1px 1px 0 #444; margin:2px" @click="update_data">Change</button>\
                <button class="w3-btn w3-blue" style="text-shadow:1px 1px 0 #444; margin:2px" @click="next_page">Next</button>\
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
        next_page: function(){
            if (this.js_data === null) {
                alert("Press load data!")
            } else {
                this.$emit('next-page',2);
            }
        },
    },
    mounted: function(){
        $("#jsGrid").jsGrid({
            width: "100%",
            height: "600px",

            filtering: false,
            inserting: true,
            editing: true,
            sorting: true,
            paging: true,
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