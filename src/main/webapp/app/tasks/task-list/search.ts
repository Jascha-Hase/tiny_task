import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'taskfilter'
})
export class TaskFilter implements PipeTransform {
    transform(items: any, filter: any, defaultFilter: boolean): any {

        if (!filter || !Array.isArray(items)) {
            return items;
        }
        let filterKeys = Object.keys(filter);

        if (defaultFilter) {
            return items.filter(item =>
                filterKeys.reduce((x, keyName) =>
                    (x && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] == "", true));
        } else {
            return items.filter(item => {
                return filterKeys.some((keyName) => {
                    return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] == "";
                });
            });
        }
    }
}