const searchBlock = document.querySelector(".search-rep")
const resultsArea = document.querySelector(".results")
const searchArea = document.querySelector("#search")
const optGroupResults = document.querySelector(".context-res")
const suggBox = document.querySelector(".opt")


let text
let results = []

const debounce = (fn, debounceTime) => {
  let timer
  return function(...args){
    const fnCall = () => {
      fn.apply(this, args)
    }
    clearTimeout(timer)
    timer = setTimeout(fnCall,debounceTime)
  }
}

function createOption(arr) {

  if (suggBox.children.length === 0) {
    for (let i = 0; i < 5; i++) {
      const option = document.createElement("option")
      console.log(arr[i])
      option.dataset.name = arr[i].name
      option.dataset.owner = arr[i].owner
      option.dataset.stars = arr[i].stars
      option.textContent = arr[i].name
      suggBox.appendChild(option)
    }
  }
  else {
    for (let i = 0; i < 5; i++) {
      const option = document.createElement("option")
      option.dataset.name = arr[i].name
      option.dataset.owner = arr[i].owner
      option.dataset.stars = arr[i].stars
      option.textContent = arr[i].name
      suggBox.replaceChild(option, suggBox.childNodes[i])
    }
  }
}


function getReq(text) {
  const xhr = new XMLHttpRequest()
  xhr.open("GET",`https://api.github.com/search/repositories?q=${text}`)
  xhr.setRequestHeader("Accept", "application/vnd.github.v3+json")
  xhr.send()
  xhr.onload = function() {
    let a = JSON.parse(xhr.response)
    results = []
    for (let elem of Object.values(a.items)){
      let res = {}
      res.name = elem.name
      res.stars = elem.stargazers_count
      res.owner = elem.owner.login
      results.unshift(res)
    }
    createOption(results)
  }
}

let debGetReq = debounce(getReq, 600)

function createResult(response){
  const fragment = document.createDocumentFragment()
  const result = document.createElement("div")
  result.classList.add("test")
  const name = document.createElement("p")
  name.textContent = `Name: ${response.dataset.name}`
  const owner = document.createElement("p")
  owner.textContent = `Owner: ${response.dataset.owner}`
  const stars = document.createElement("p")
  stars.textContent = `Stars: ${response.dataset.stars}`
  const delImg = document.createElement('img')
  delImg.src = "./img/del.png"
  delImg.classList.add("del-btn")
  delImg.onclick = function(){
    result.style.display = "none"
    resultsArea.removeChild(result)
  }
  result.appendChild(name)
  result.appendChild(owner)
  result.appendChild(stars)
  result.appendChild(delImg)
  result.style.border = "1px solid black"
  result.style.background = "#E27BEB"
  fragment.appendChild(result)
  return fragment
}

searchArea.addEventListener("focus", (e) => {
  optGroupResults.style.display = "block"
})

searchArea.addEventListener("keyup", (e) => {
  text = e.target.value
  debGetReq(text)
})

optGroupResults.addEventListener("click", (e) => {
  let target = e.target
  let arr = Array.from(resultsArea.children)
  console.log(arr)
  console.log(target)
  arr.push(createResult(target))
  arr.forEach(elem => {
    if (resultsArea.children.length < 3){
      resultsArea.appendChild(elem)
    }
  })
})



