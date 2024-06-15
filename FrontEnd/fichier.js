async function requestWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  return data;
}

async function requestCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const data = await response.json();
  return data;
}

function displayWorks(works) {
  const galleryContainer = document.querySelector(".gallery");
  galleryContainer.innerHTML = "";
  for (const work of works) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.classList.add("imgPortfolio");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    galleryContainer.appendChild(figure);
  }
}

async function displayCategories() {
  const filterContainer = document.querySelector("#filters");
  filterContainer.innerHTML = "";

  const buttonALL = document.createElement("button");
  buttonALL.textContent = "Tous";
  buttonALL.classList.add("button_filter");
  buttonALL.classList.add("button_ALL", "btnHide");
  buttonALL.addEventListener("click", async () => {
    const works = await requestWorks();
    displayWorks(works);
  });
  filterContainer.appendChild(buttonALL);

  const dataCategories = await requestCategories();

  for (const category of dataCategories) {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("button_filter", "btnHide");
    button.setAttribute("data-id-categorie", category.id);
    filterContainer.appendChild(button);
    button.addEventListener("click", async (event) => {
      const categoryId = Number(event.target.getAttribute("data-id-categorie"));
      displayWorksByCategory(categoryId);
    });
  }
  const buttons = document.querySelectorAll(".button_filter");
  console.log(buttons);
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((button) => {
        buttonALL.classList.remove("button_filter_selected");
        button.classList.remove("button_filter_selected");
        buttonALL.classList.add("button_filter_selected");
      });
      button.classList.add("button_filter_selected");
    });
  });
}

async function displayWorksByCategory(categoryId) {
  const allWorks = await requestWorks();
  const filteredWorks = allWorks.filter(
    (work) => work.categoryId === categoryId
  );
  displayWorks(filteredWorks);
}

async function initialize() {
  const allWorks = await requestWorks();
  await displayWorks(allWorks);
  await displayCategories();

  // Vérifie si le token est présent dans le localStorage
  const token = localStorage.getItem("token");
  const showButton = document.getElementById("dialogBtn");
  const loginLogout = document.getElementById("loginLogout");
  const topBanner = document.getElementById("topBanner");

  if (token) {
    showButton.classList.remove("hidden");
    document.querySelectorAll(".btnHide").forEach((button) => {
      button.classList.add("hidden");
    });
    loginLogout.textContent = "logout";
    topBanner.classList.remove("hidden");
  } else {
    showButton.classList.add("hidden");
    document
      .querySelectorAll(".btnHide")
      .forEach((button) => button.classList.remove("hidden"));
    loginLogout.textContent = "login";
    topBanner.classList.add("hidden");
  }
}

initialize();

if (localStorage.getItem("token")) {
  console.log("user connected");
}

async function getFileFromUrl(url, name, defaultType = "image/jpeg") {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type || defaultType,
  });
}

const formSchema = {
  title: false,
  image: false,
  category: false,
};

const dialog = document.querySelector("dialog");
const showButton = document.getElementById("dialogBtn");
const closeButton = document.getElementById("dialogCloseBtn");
const imageInput = document.getElementById("imageInput");
const btnAddImg = document.getElementById("btnAddImg");
const imagesInputContainer = document.getElementById("imagesInputContainer");
const beforeadd = document.getElementById("beforeadd");
const afteradd = document.getElementById("afteradd");
const right = document.getElementById("right");
const btnafteradd = document.getElementById("btnafteradd");
const addImg = document.getElementById("addImg");
const titleInput = document.getElementById("titleInput");
const categoryInput = document.getElementById("categoryInput");
const btnsubmit = document.getElementById("btnsubmit");
const imgFormContainer__input = document.getElementById(
  "imgFormContainer__input"
);
const imgFormContainer__input_img = document.getElementById(
  "imgFormContainer__input_img"
);

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const fileList = [];

// const images = await Promise.all(
//   auction.images.map((image) =>
//     getFileFromUrl(
//       `${process.env.NEXT_PUBLIC_APP_URL}${image.path}`,
//       image.path
//     )
//   )
// );
const worksIdArray = [];
const DisplayWorksOnModal = async () => {
  const works = await requestWorks();
  console.log(works);
  imageFiles = await Promise.all(
    works.map((el) => {
      worksIdArray.push(el.id);
      return getFileFromUrl(el.imageUrl, `image-${el.title}`);
    })
  );
  const dataTransfer = new DataTransfer();
  for (el of imageFiles) {
    dataTransfer.items.add(el);
  }
  imageInput.files = dataTransfer.files;

  imageInput.dispatchEvent(new Event("change"));

  const categories = await fetch("http://localhost:5678/api/categories").then(
    (res) => res.json()
  );
  const option = document.createElement("option");
  option.innerText = "";
  option.value = "null";
  categoryInput.appendChild(option);
  for (category of categories) {
    const option = document.createElement("option");
    option.innerText = category.name;
    option.value = category.id;
    categoryInput.appendChild(option);
  }
};

titleInput.addEventListener("change", (e) => {
  if (e.target.value !== "") {
    formSchema.title = true;
  } else {
    formSchema.title = false;
  }

  if (formSchema.title && formSchema.image && formSchema.category) {
    btnsubmit.classList.add("btnAddImg");
  } else {
    btnsubmit.classList.remove("btnAddImg");
  }
});

categoryInput.addEventListener("change", (e) => {
  if (e.target.value !== "null") {
    formSchema.category = true;
  } else {
    formSchema.category = false;
  }

  if (formSchema.title && formSchema.image && formSchema.category) {
    btnsubmit.classList.add("btnAddImg");
  } else {
    btnsubmit.classList.remove("btnAddImg");
  }
});

showButton.addEventListener("click", () => {
  dialog.showModal();
});

closeButton.addEventListener("click", () => {
  dialog.close();
});
btnAddImg.addEventListener("click", () => {
  beforeadd.classList.add("hidden");
  afteradd.classList.remove("hidden");
  right.classList.add("right-afteradd");
  btnafteradd.classList.remove("hidden");
  // console.log("clicked");
  // imageInput.click();
});
addImg.addEventListener("click", () => {
  imageInput.click();
});

imgFormContainer__input_img.addEventListener("click", () => {
  imageInput.click();
});
btnsubmit.addEventListener("click", async (e) => {
  e.preventDefault();
  if (formSchema.category && formSchema.image && formSchema.title) {
    const formdata = new FormData();
    formdata.append("title", titleInput.value);
    formdata.append("category", categoryInput.value);
    formdata.append("image", fileList.at(-1));
    await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: formdata,
    })
      .then(async (res) => {
        const json = await res.json();
        console.log(json);
        console.log(res);

        const galleryContainer = document.querySelector(".gallery");
        // galleryContainer.innerHTML = "";

        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.classList.add("imgPortfolio");
        img.src = json.imageUrl;
        img.alt = json.title;

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = json.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);

        galleryContainer.appendChild(figure);
      })
      .catch((res) => console.log("suka" + res));
  }
});
btnafteradd.addEventListener("click", () => {
  beforeadd.classList.remove("hidden");
  afteradd.classList.add("hidden");
  right.classList.remove("right-afteradd");
  btnafteradd.classList.add("hidden");
});

initialState = true;
imageInput.onchange = async function (e) {
  const prevLength = fileList.length;
  fileList.splice(0, fileList.length);
  console.log(prevLength);
  for (file of e.target.files) {
    fileList.push(file);
  }

  const nextLength = fileList.length;
  console.log(nextLength);

  if (nextLength === 1 && prevLength !== 0) {
    formSchema.image = true;
    imgFormContainer__input.classList.add("hidden");
    imgFormContainer__input_img.classList.remove("hidden");
    imgFormContainer__input_img.src = await toBase64(fileList.at(-1));
  } else {
    formSchema.image = false;
    imgFormContainer__input.classList.remove("hidden");
    imgFormContainer__input_img.classList.add("hidden");
  }

  initialState = false;

  if (formSchema.title && formSchema.image) {
    btnsubmit.classList.add("btnAddImg");
  } else {
    btnsubmit.classList.remove("btnAddImg");
  }

  for (let i = 0; i < fileList.length; i++) {
    const div = document.createElement("div");
    div.classList.add("div");
    div.id = `${i}`;

    const img = document.createElement("img");
    img.src = await toBase64(fileList[i]);
    img.classList.add("img");
    const btn = document.createElement("button");
    btn.classList.add("imgDeleteBtn");
    btn.onclick = () => {
      let workId = worksIdArray[i];
      DeleteWorks(workId);

      div.remove();
      fileList.splice(i, 1);
      const dataTransfer = new DataTransfer();
      for (el of fileList) {
        dataTransfer.items.add(el);
      }
      imageInput.files = dataTransfer.files;
    };
    const font = document.createElement("i");
    font.classList.add("fa-solid");
    font.classList.add("fa-trash-can");
    btn.appendChild(font);
    div.appendChild(btn);
    div.appendChild(img);
    imagesInputContainer.appendChild(div);
  }
};

DisplayWorksOnModal();
async function DeleteWorks(id) {
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  console.log(response);
  return "succes";
}
