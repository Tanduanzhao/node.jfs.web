import React from 'react';
import {Ajax} from './functions/ajax.js';
export default class TotalPost extends React.Component {
  componentDidMount(){
    var myChart = echarts.init(this.refs.totalPost);
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '用户文章统计报表'
        },
        tooltip: {},
        legend: {
            data:['文章数']
        },
        xAxis: {
            data: []
        },
        yAxis: {},
        series: [{
            name: '文章数',
            type: 'bar',
            data: []
        }]
      };

      // 使用刚指定的配置项和数据显示图表。
      this.chart = myChart.setOption(option);
      myChart.showLoading();
      this._loadData()
                .then((datas)=>{
                    myChart.hideLoading();
                    myChart.setOption({
                        xAxis: {
                            data: datas.userList
                        },
                        series: [{
                            name: '文章数',
                            data: datas.postNum
                        }]
                    })
                })
  }
  _loadData(){
      return new Promise((resolve,reject)=>{
          Ajax({
              url:'/total/post',
              method:'GET'
          })
          .then((res)=>{
              if(res.status == 1){
                  resolve(res.datas)
              }
          })
      })
  }
  componentWillUnmount(){
    console.log(this);
    return false;
  }
  render(){
    return(
        <div ref="totalPost" style={{width:'100%',height:'300px'}} id="totalPost"></div>
    )
  }
}
