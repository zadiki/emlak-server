export const getPropertyTypeCounts=(propertylist)=>{
  var  propertycount={
      "Apartment":0,
      "Land":0,
      "House":0,
      "Hotel":0,
      "Work_place":0
  }
  propertylist.map((property)=>{
    switch (property.Category) {
      case "Apartment":
          propertycount.Apartment++;
        break;
      case "Land":
          propertycount.Land++;
        break;
      case "House":
          propertycount.House++;
        break
      case "Hotel":
          propertycount.Hotel++;
        break;
      case "Work place":
          propertycount.Work_place++;
        break;
      default:
    }
  });

  return propertycount
}
