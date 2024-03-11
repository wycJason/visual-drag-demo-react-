import React from 'react';
import './grid-control.scss';

import ODataStore from 'devextreme/data/odata/store';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Pager,
  Paging,
  SearchPanel,
} from 'devextreme-react/data-grid';

import DiscountCell from '../../components/discount-cell/DiscountCell';

const pageSizes = [10, 25, 50, 100];

const dataSourceOptions = {
  store: new ODataStore({
    url: 'https://js.devexpress.com/Demos/SalesViewer/odata/DaySaleDtoes',
    key: 'Id',
    beforeSend(request) {
      const year = new Date().getFullYear() - 1;
      request.params.startDate = `${year}-05-10`;
      request.params.endDate = `${year}-5-15`;
    },
  }),
};

/* export default () => (
  <React.Fragment>
    <h2 className={'content-block'}>网格控件</h2>
    <div className={'content-block'}>
      <div className={'dx-card responsive-paddings'}>


      </div>
    </div>
  </React.Fragment>
); */


export default class App extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      collapsed: false,
    };
    this.onContentReady = this.onContentReady.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <h2 className={'content-block'}>网格控件</h2>
        <div className={'content-block'}>
          <div className={'dx-card responsive-paddings'}>
            <DataGrid
              dataSource={dataSourceOptions}
              allowColumnReordering={true}
              rowAlternationEnabled={true}
              showBorders={true}
              width="100%"
              onContentReady={this.onContentReady}
            >
              <GroupPanel visible={true} />
              <SearchPanel visible={true} highlightCaseSensitive={true} />
              <Grouping autoExpandAll={false} />

              <Column dataField="Product" groupIndex={0} />
              <Column
                dataField="Amount"
                caption="Sale Amount"
                dataType="number"
                format="currency"
                alignment="right"
              />
              <Column
                dataField="Discount"
                caption="Discount %"
                dataType="number"
                format="percent"
                alignment="right"
                allowGrouping={false}
                cellRender={DiscountCell}
                cssClass="bullet"
              />
              <Column dataField="SaleDate" dataType="date" />
              <Column dataField="Region" dataType="string" />
              <Column dataField="Sector" dataType="string" />
              <Column dataField="Channel" dataType="string" />
              <Column dataField="Customer" dataType="string" width={150} />

              <Pager allowedPageSizes={pageSizes} showPageSizeSelector={true} />
              <Paging defaultPageSize={10} />
            </DataGrid>

          </div>
        </div>
      </React.Fragment>
    );
  }

  onContentReady(e: any) {
    if (!(this.state as any).collapsed) {
      e.component.expandRow(['EnviroCare']);
      this.setState({
        collapsed: true,
      });
    }
  }
}