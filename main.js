//Подключение json

fetch(
  "https://raw.githubusercontent.com/altkraft/for-applicants/master/frontend/titanic/passengers.json"
)
  .then((response) => response.json())
  .then((json) => data(json));

//Удаление лишних элементов
let gData = undefined;

const data = (json) => {
  gData = json = json.map((x) => {
    delete x["sibsp"];
    delete x["parch"];
    delete x["fare"];
    delete x["embarked"];
    delete x["body"];
    delete x["boat"];
    delete x["cabin"];
    delete x["home.dest"];
    return x;
  });
  addTableHeader(Object.keys(json[0]));
  addTableData(json);
};

//Создание и заполнение thead

const addTableHeader = (fields) => {
  const table = document.querySelector(".table");
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  const fragment = document.createDocumentFragment();
  fields.forEach((x) => {
    const th = document.createElement("th");
    th.innerText = x;
    th.scope = "col";
    th.id = x;
    fragment.appendChild(th);
  });
  tr.appendChild(fragment);
  thead.appendChild(tr);
  table.appendChild(thead);
  clickFilterEvents(fields);
};

//Создание и заполнение tbody

const addTableData = (data) => {
  const table = document.querySelector(".table");
  const tbody = document.createElement("tbody");
  data.forEach((x) => {
    const tr = document.createElement("tr");
    const fragment = document.createDocumentFragment();
    const keys = Object.keys(data[0]);
    keys.forEach((y) => {
      const td = document.createElement("td");
      td.innerText = x[y];
      // td.className = x[y];
      fragment.appendChild(td);
    });
    tr.appendChild(fragment);
    tbody.appendChild(tr);
    table.appendChild(tbody);
  });
};

const deleteTableData = () => {
  const tbody = document.querySelector(".table tbody");
  tbody.remove();
};

//Сортировка

const clickFilterEvents = (fields) => {
  fields.forEach((x) => {
    const thisTh = document.querySelector(`#${x}`);
    const trigsort = sort();
    thisTh.addEventListener("click", (e) => {
      deleteTableData();
      trigsort(e);
    });
  });
};

const sort = () => {
  let trigger = 1;
  return (e) => {
    trigger = -trigger;
    gData.sort((a, b) => {
      if (a[e.target.id] > b[e.target.id]) {
        return trigger;
      } else {
        return -trigger;
      }
    });
    addTableData(gData);
  };
};

// Поиск...

const input = document.querySelector("#input");
input.addEventListener("input", (e) => {
  const searchText = e.target.value.toLowerCase();
  const tbody = document.querySelector(".table tbody");
  const headerTh = document.querySelectorAll(".table thead th");
  let obj = [];
  // Массив данных
  for (let index = 0; index < tbody.children.length; index++) {
    obj[index] = {};
    for (let j = 0; j < tbody.children[index].children.length; j++) {
      const fields = headerTh[j].id;
      obj[index][fields] = tbody.children[index].children[j].innerText.toLowerCase();
    }
  }

  obj.forEach((x, i) => {
    for (let text in x) {
      if (x[text].includes(searchText)) {
        tbody.children[i].hidden = false;
        return true;
      } else {
        tbody.children[i].hidden = true;
      }
    }
  });
});


