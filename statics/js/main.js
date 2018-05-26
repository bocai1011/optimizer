Vue.component('main-page', {
    template: '<div style="width:1200px">\
        <div>\
            <button class="w3-button" style="width:33%" @click="switchTab(1)">Load Data</button>\
            <button class="w3-button" style="width:33%" @click="switchTab(2)">Optimize</button>\
            <button class="w3-button" style="width:33%" @click="switchTab(3)">Result</button>\
        </div>\
        <keep-alive>\
            <component v-bind:is="currentTab"></component>\
        </keep-alive>\
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