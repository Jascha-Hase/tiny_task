import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'taskfilter'
})
export class TaskFilter implements PipeTransform {
    transform(items: any, filter: any, defaultFilter: boolean): any {
        if (!filter) {
            console.log('Search for nothing');
            return items;
        }

        if (!Array.isArray(items)) {
            console.log('Tets 2s');
            return items;
        }

        if (filter && Array.isArray(items)) {
            let filterKeys = Object.keys(filter);
            console.log('Something Else');

            if (defaultFilter) {
                console.log('Something');
                return items.filter(item =>
                    filterKeys.reduce((x, keyName) =>
                        (x && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] == "", true));
            }
            else {
                return items.filter(item => {
                    return filterKeys.some((keyName) => {
                        return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] == "";
                    });
                });
            }
        }
    }
}