Vue.component('tab1', {
    template: '<div>\
        <div id="jsGrid"></div>\
        <button class="w3-button w3-round w3-blue" @click="load_data">Load Data</button>\
        <button class="w3-button w3-round w3-blue" @click="update_data">Update</button>\
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
            height: "800px",
            width: "1500px",

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
Vue.component('tab2', {
    template: "<div>Hello p2</div>",
})
Vue.component('tab3', {
    template: "<div>Hello p3</div>",
})
Vue.component('tab4', {
    template: "<div>Hello p4</div>",
})
Vue.component('main-page', {
    template: '<div>\
        <div style="width:800px;height:40px;display:flex;justify-content:space-between">\
            <button class="w3-button" @click="switchTab(1)">Load Data</button>\
            <button class="w3-button" @click="switchTab(2)">Filter</button>\
            <button class="w3-button" @click="switchTab(3)">Tab3</button>\
            <button class="w3-button" @click="switchTab(4)">Tab4</button>\
        </div>\
        <keep-alive>\
            <component v-bind:is="currentTab"></component>\
        </keep-alive>\
    </div>',
    data: function(){
        return {
            currentTab: 'tab1',
        }
    },
    methods:{
        switchTab: function(a){
            this.currentTab = 'tab' + a;
        }
    },
})
new Vue({
    el: '#app',
})