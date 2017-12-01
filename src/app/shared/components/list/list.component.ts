import { IListDataSource } from '../../data-sources/list=data-source-types';
import { ITableColumn, ITableText } from '../table/table.types';
import { LocalListDataSource } from '../../data-sources/list-data-source-local';
import { CfListDataSource } from '../../data-sources/list-data-source-cf';
import { Component, Input, OnInit, Type, OnDestroy, ViewChild, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';

import { NgForm, NgModel } from '@angular/forms';
import {
  ListView, SetListViewAction, ListFilter, SetListFilterAction, ListPagination, SetListPaginationAction, SetListSortAction, ListSort
} from '../../../store/actions/list.actions';
import { Store, Action } from '@ngrx/store';
import { AppState } from '../../../store/app-state';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MdPaginator, PageEvent, MdSelect, MdSelectChange, SortDirection } from '@angular/material';

export class ListConfig implements IListConfig<any> {
  getGlobalActions = () => null;
  getMultiActions = () => null;
  getSingleActions = () => null;
  getColumns = () => null;
  getDataSource = () => null;
}

export interface IListConfig<T> {
  getGlobalActions: () => IGlobalListAction<T>[];
  getMultiActions: () => IMultiListAction<T>[];
  getSingleActions: () => IListAction<T>[];
  getColumns: () => ITableColumn<T>[];
  getDataSource: () => CfListDataSource<T> | LocalListDataSource<T>;
}

export interface IBaseListAction<T> {
  icon: string;
  label: string;
  description: string;
  visible: (row: T) => boolean;
  enabled: (row: T) => boolean;
}

export interface IListAction<T> extends IBaseListAction<T> {
  action: (item: T) => void;
}

export interface IMultiListAction<T> extends IBaseListAction<T> {
  action: (items: T[]) => void;
}

export interface IGlobalListAction<T> extends IBaseListAction<T> {
  action: () => void;
}


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent<T> implements OnInit, OnDestroy, AfterViewInit {
  private uberSub: Subscription;

  @Input('text') text = null as ITableText;
  @Input('enableFilter') enableFilter = false;
  @Input('tableFixedRowHeight') tableFixedRowHeight = false;
  @Input('cardComponent') cardComponent: Type<{}>;
  @Input('addForm') addForm: NgForm;


  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('filter') filter: NgModel;

  sortColumns: ITableColumn<T>[];
  @ViewChild('headerSortField') headerSortField: MdSelect;
  headerSortDirection: SortDirection = 'asc';
  headerSortDirectionChanged = new EventEmitter<SortDirection>();

  globalActions: IListAction<T>[];
  multiActions: IMultiListAction<T>[];
  singleActions: IListAction<T>[];
  columns: ITableColumn<T>[];
  dataSource: IListDataSource<T>;

  public safeAddForm() {
    // Something strange is afoot. When using addform in [disabled] it thinks this is null, even when initialised
    // When applying the question mark (addForm?) it's value is ignored by [disabled]
    return this.addForm || {};
  }

  constructor(
    private _store: Store<AppState>,
    private cd: ChangeDetectorRef,
    private listConfigService: ListConfig
  ) { }

  ngOnInit() {

    this.globalActions = this.listConfigService.getGlobalActions();
    this.multiActions = this.listConfigService.getMultiActions();
    this.singleActions = this.listConfigService.getSingleActions();
    this.columns = this.listConfigService.getColumns();
    this.dataSource = this.listConfigService.getDataSource();

    const paginationStoreToWidget = this.dataSource.pagination$.do((pagination: ListPagination) => {
      this.paginator.length = pagination.totalResults;
      this.paginator.pageIndex = pagination.pageIndex;
      this.paginator.pageSize = pagination.pageSize;
      this.paginator.pageSizeOptions = pagination.pageSizeOptions;
    });

    const paginationWidgetToStore = this.paginator.page.do((page: PageEvent) => {
      this._store.dispatch(new SetListPaginationAction(
        this.dataSource.listStateKey,
        {
          pageSize: page.pageSize,
          pageIndex: page.pageIndex,
        }
      ));
    });

    const filterStoreToWidget = this.dataSource.filter$.do((filter: ListFilter) => {
      this.filter.model = filter.filter;
    });

    const filterWidgeToStore = this.filter.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .map(value => value as string)
      .do((stFilter) => {
        this._store.dispatch(new SetListFilterAction(
          this.dataSource.listStateKey,
          {
            filter: stFilter
          }
        ));
      });

    this.sortColumns = this.columns.filter((column: ITableColumn<T>) => {
      return column.sort;
    });
    const sortStoreToWidget = this.dataSource.sort$.do((sort: ListSort) => {
      this.headerSortField.value = sort.field;
      this.headerSortDirection = sort.direction;
    });

    this.uberSub = Observable.combineLatest(
      paginationStoreToWidget,
      paginationWidgetToStore,
      filterStoreToWidget,
      filterWidgeToStore,
      sortStoreToWidget,
    ).subscribe();

    this.dataSource.connect();
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.uberSub.unsubscribe();
  }

  updateListView(listView: ListView) {
    this._store.dispatch(new SetListViewAction(this.dataSource.listStateKey, listView));
  }

  updateListSort(field: string, direction: SortDirection) {
    this.headerSortField.value = field;
    this.headerSortDirection = direction;
    this._store.dispatch(new SetListSortAction(
      this.dataSource.listStateKey,
      {
        field: field,
        direction: direction,
      }
    ));
  }

  executeActionMultiple(action: IMultiListAction<T>['action']) {
    action(Array.from(this.dataSource.selectedRows.values()));
    this.dataSource.selectClear();
  }

  executeActionGlobal(action: IGlobalListAction<T>['action']) {
    action();
  }

}
