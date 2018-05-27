Vue.component('main-page', {
    template: '<div>\
        <div class="w3-card-2 w3-black w3-large">\
            <button class="w3-button" style="width:32%; text-shadow:1px 1px 0 #444" @click="switchTab(1)">Load Data</button>\
            <button class="w3-button" style="width:32%; text-shadow:1px 1px 0 #444" @click="switchTab(2)">Optimization</button>\
            <button class="w3-button" style="width:32%; text-shadow:1px 1px 0 #444" @click="switchTab(3)">Result</button>\
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
            currentTab: 'load-page',
        }
    },
    methods:{
        switchTab: function(num){
            if (num == 1) this.currentTab = 'load-page';
            if (num == 2) this.currentTab = 'optimize-page';
            if (num == 3) this.currentTab = 'result-page';
        }
    },
})
new Vue({
    el: '#app',
})