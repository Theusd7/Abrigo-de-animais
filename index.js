import express from "express";

const app = express();
app.use(express.json());

const pets = [
  { id: 1, nome: "tobi", especie: "cachorro", idade: 3, adotado: false },
  { id: 2, nome: "saphira", especie: "gato", idade: 1, adotado: false },
  { id: 3, nome: "Bolinha", especie: "coelho", idade: 5, adotado: true },
];
let ultimoId = 3;
function buscarPets() {
  return pets;
}


function buscarPet(id) {
  return pets.find((pet) => pet.id === id);
}


function criarPet(nome, especie, idade) {
  const pet = {
    id: ++ultimoId,
    nome: nome.trim(),
    especie: especie.trim(),
    idade,
    adotado: false,
  };

  pets.push(pet);
  return pet;
}

function editarPet(id, alteracoes) {
  const pet = buscarPet(id);
  if (!pet) return undefined;
  Object.assign(pet, alteracoes);
  return pet;
}

function deletarPet(id) {
  const indice = pets.findIndex((pet) => pet.id === id);
  if (indice === -1) return false;
  pets.splice(indice, 1);
  return true;
}

app.get("/pets", (req, res) => {
  res.status(200).json(buscarPets());
});

app.get("/pets/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ mensagem: "ID invalido" });
  }
  const pet = buscarPet(id);
  if (!pet) {
    return res.status(404).json({ mensagem: "Pet nao encontrado" });
  }
  res.status(200).json(pet);
});



app.post("/pets", (req, res) => {
  const { nome, especie, idade } = req.body;

  if (typeof nome !== "string" || nome.trim() === "" ||
      typeof especie !== "string" || especie.trim() === "") {
    return res.status(400).json({ mensagem: "Informe o nome e a especie" });
  }

  if (typeof idade !== "number" || !Number.isFinite(idade) || idade < 0) {
    return res.status(400).json({ mensagem: "Idade invalida" });
  }

  const pet = criarPet(nome, especie, idade);

  res.status(201).json(pet);
});


app.patch("/pets/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ mensagem: " id invalido" });
  }

  if (!buscarPet(id)) {
    return res.status(404).json({ mensagem: " nao encontrado" });
  }

  const { nome, especie, idade, adotado } = req.body;
  const alteracoes = {};

  if (nome !== undefined) {
    if (typeof nome !== "string" || nome.trim() === "") {
      return res.status(400).json({ mensagem: "Nome invalido" });
    }

    alteracoes.nome = nome.trim();
  }

  if (especie !== undefined) {
    if (typeof especie !== "string" || especie.trim() === "") {
      return res.status(400).json({ mensagem: "Especie invalida" });
    }

    alteracoes.especie = especie.trim();
  }

  if (idade !== undefined) {
    if (typeof idade !== "number" || !Number.isFinite(idade) || idade < 0) {
      return res.status(400).json({ mensagem: "Idade invalida" });
    }

    alteracoes.idade = idade;
  }

  if (adotado !== undefined) {
    if (typeof adotado !== "boolean") {
      return res.status(400).json({ mensagem: "Adocao invalida" });
    }

    alteracoes.adotado = adotado;
  }

  if (Object.keys(alteracoes).length === 0) {
    return res.status(400).json({ mensagem: "Informe um campo para alterar" });
  }

  const pet = editarPet(id, alteracoes);

  res.status(200).json(pet);
});

app.delete("/pets/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ mensagem: "ID invalido" });
  }

  if (!deletarPet(id)) {
    return res.status(404).json({ mensagem: "Pet nao encontrado" });
  }

  res.status(204).send();
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});