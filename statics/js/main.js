Vue.component('welcome-page', {
    template: '<div style="display:flex;align-items:center">\
        <img class="w3-animate-left" src="/static/img/Mushroom.png" style="width:200px;height:200px;margin:200px 40px;"/>\
        <h1 class="w3-jumbo w3-text-blue w3-animate-top" style="text-shadow:3px 3px 0 #444;font-weight:bold"> Portfolio Optimizer <span class="w3-tag w3-round-xlarge w3-blue w3-margin-left">V1.0</span> </h1>\
    </div>',
});
Vue.component('main-page', {
    template: '<div>\
        <div class="w3-card-2 w3-black w3-large">\
            <button class="w3-button" @click="switchTab(0)"><img src="/static/img/home.png" style="width:24px;height:24px;margin:0px 12px"/></button>\
            <button class="w3-button" style="width:30%; text-shadow:1px 1px 0 #444;font-weight:bold" @click="switchTab(1)">Load Data</button>\
            <button class="w3-button" style="width:30%; text-shadow:1px 1px 0 #444;font-weight:bold" @click="switchTab(2)">Optimization</button>\
            <button class="w3-button" style="width:30%; text-shadow:1px 1px 0 #444;font-weight:bold" @click="switchTab(3)">Result</button>\
        </div>\
        <div class="w3-margin">\
            <keep-alive>\
                <component v-on:next-page="switchTab" v-bind:is="currentTab"></component>\
            </keep-alive>\
        </div>\
        <footer class="w3-small w3-opacity w3-center w3-margin-top">\
            <hr>\
            © 2018, Bo Cai. All Rights Reserved.\
        </footer>\
    </div>',
    data: function(){
        return {
            currentTab: 'welcome-page',
        }
    },
    methods:{
        switchTab: function(num){
            if (num == 0) this.currentTab = 'welcome-page';
            if (num == 1) this.currentTab = 'load-page';
            if (num == 2) this.currentTab = 'optimize-page';
            if (num == 3) this.currentTab = 'result-page';
        }
    },
});
new Vue({
    el: '#app',
});