import Pud from "./entity/Pud";

class Sorting {
  sort(input: string, toSort: Pud[]) {
    if (input.length === 0) return [];
    let sort = toSort.sort(function (a: Pud, b: Pud) {
      let a_ = a.id === input || a.name === input ? input.length : 0;
      if (a_ === 0) {
        a_ = a.id.includes(input) || a.name.includes(input) ? input.length : 0;
      }
      let b_ = b.id === input || b.name === input ? input.length : 0;
      if (b_ === 0) {
        b_ = b.id.includes(input) || b.name.includes(input) ? input.length : 0;
      }
      return b_ - a_;
    });
    sort = sort.filter(
      (a: Pud) => a.name.includes(input) || a.id.includes(input)
    );
    if (sort.length > 3) sort = sort.slice(0, 3);
    console.log(sort);
    return sort;
  }
}

export default new Sorting();
