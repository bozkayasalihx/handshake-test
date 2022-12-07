/* eslint-disable one-var */
export class MergeSort {
    public mergeSort(input: number[]): number[] | undefined {
        if (input.length <= 1) return;

        const mid = Math.floor(input.length / 2);
        const left = Array(mid);
        const right = Array(input.length - mid);

        for (let i = 0; i < mid; i++) {
            left[i] = input[i];
        }
        let k = 0;
        for (let i = mid; i < input.length; i++) {
            right[k] = input[i];
            k++;
        }

        this.mergeSort(left);
        this.mergeSort(right);
        return this.merge(input, left, right);
    }

    private merge(input: number[], left: number[], right: number[]) {
        let i = 0,
            j = 0,
            k = 0;

        while (i < left.length && j < right.length) {
            if (left[i] < right[j]) {
                input[k] = left[i];
                k++;
                i++;
            } else {
                input[k] = right[j];
                k++;
                j++;
            }
        }

        while (i < left.length) {
            input[k] = left[i];
            k++;
            i++;
        }

        while (j < right.length) {
            input[k] = right[j];
            j++;
            k++;
        }

        return input;
    }
}

export const merger = new MergeSort();
