const fetchData = async (setDataApi) => {
  try {
    const urlApi = "http://localhost:5000/companies";
    const response = await fetch(urlApi);
    const json = await response.json();
    //console.log(json);
    setDataApi(json);
    return json;
  } catch (error) {
    console.log("error", error);
  }
};
export default fetchData;
