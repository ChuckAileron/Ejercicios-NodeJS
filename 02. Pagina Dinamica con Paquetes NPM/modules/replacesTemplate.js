//En NodeJS cada archivo es tratado como un modulo
//Para acceder a una funcion incluida en otro archivo, se debe importar el modulo

//Funcion que reemplaza los placeholders por los valores del JSON
//La bandera "g" hace que todos los placeholders de ese tipo sean cambiados
//Este modulo exporta una funcion anonima
module.exports = (temp, char) => {
  //Hacerlo let y no const le permite mutar luego de ser creado
  let output = temp.replace(/{%CHARNAME%}/g, char.charName);
  output = output.replace(/{%SPRITE%}/g, char.sprite);
  output = output.replace(/{%PORTRAIT%}/g, char.portrait);
  output = output.replace(/{%ATTACK%}/g, char.attack);
  output = output.replace(/{%FROM%}/g, char.from);
  output = output.replace(/{%SWORDIAN%}/g, char.swordian);
  output = output.replace(/{%POWERTYPE%}/g, char.powertype);
  output = output.replace(/{%DESCRIPTION%}/g, char.description);
  output = output.replace(/{%ID%}/g, char.id);

  if (!char.ssr) output = output.replace(/{%NOT_SSR%}/g, 'not-ssr');

  return output;
};
