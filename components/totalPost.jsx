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

      var myCharts = echarts.init(document.getElementById('feedbackPost'));
      option = {
          title: {
              text: '用户投诉统计报表'
          },
          tooltip: {},
          legend: {
              data:['投诉数']
          },
          xAxis:  {
              axisLabel: {
                  interval: 0,//横轴信息全部显示
                  rotate: 360,//60度角倾斜显示,
                  formatter: function (val) {
                      return val.split("年").join("年\n"); //横轴信息文字竖直显示}
                  }
              },
              data:[]
          },
          yAxis: {},
          series: [
              {
                  name:'投诉数',
                  type:'line',
                  data:[]
              }
          ]
      };
      myCharts.setOption(option);
      myCharts.showLoading();
      Ajax({
          url:'/total/feedback',
          method:'GET'
      })
        .then((res)=>{
            if(res.status == 1){
                myCharts.hideLoading();
                myCharts.setOption({
                    xAxis: {
                        data:  res.datas.month
                    },
                    series: [{
                        name: '投诉数',
                        data: res.datas.monthNum
                    }]
                });
            }
        })
  }
    _downExcel(){
        window.open("/download/"+(+new Date()));
    }
    _feedbackExcel(){
        window.open("/feedbackDownload/"+(+new Date()));
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
    return false;
  }
  render(){
    return(
      <div>
          <div className="uk-button-group uk-margin-bottom">
              <button onClick={this._downExcel.bind()} className="uk-button uk-button-primary"><i className="uk-icon-download"></i>下载excel表格</button>
          </div>
          <div ref="totalPost" style={{width:'100%',height:'300px'}} id="totalPost"></div>
          <div className="uk-button-group uk-margin-bottom">
              <button onClick={this._feedbackExcel.bind()} className="uk-button uk-button-primary"><i className="uk-icon-download"></i>下载excel表格</button>
          </div>
          <div ref="feedbackPost" style={{width:'100%',height:'300px'}} id="feedbackPost"></div>
      </div>
    )
  }
}
