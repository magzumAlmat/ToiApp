export const filterDataByBudget = ({
    budget,
    guestCount,
    data,
    priceFilter,
    setFilteredData,
    setRemainingBudget,
  }) => {
    if (!budget || isNaN(budget) || parseFloat(budget) <= 0) {
      alert('Пожалуйста, введите корректную сумму бюджета');
      return;
    }
    if (!guestCount || isNaN(guestCount) || parseFloat(guestCount) <= 0) {
      alert('Пожалуйста, введите корректное количество гостей');
      return;
    }
  
    const budgetValue = parseFloat(budget);
    const guests = parseFloat(guestCount);
    let remaining = budgetValue;
    const selectedItems = [];
  
    const suitableRestaurants = data.restaurants.filter(
      (restaurant) => parseFloat(restaurant.capacity) >= guests
    );
  
    if (suitableRestaurants.length === 0) {
      alert('Нет ресторанов с достаточной вместимостью');
      return;
    }
  
    const sortedRestaurants = suitableRestaurants
      .filter((r) => parseFloat(r.averageCost) <= remaining)
      .sort((a, b) => parseFloat(a.averageCost) - parseFloat(b.averageCost));
  
    if (sortedRestaurants.length === 0) {
      alert('Нет ресторанов, подходящих под ваш бюджет');
      return;
    }
  
    let selectedRestaurant;
    if (priceFilter === 'min') {
      selectedRestaurant = sortedRestaurants[0];
    } else if (priceFilter === 'max') {
      selectedRestaurant = sortedRestaurants[sortedRestaurants.length - 1];
    } else {
      selectedRestaurant = sortedRestaurants[Math.floor(sortedRestaurants.length / 2)];
    }
  
    const restaurantCost = parseFloat(selectedRestaurant.averageCost);
    selectedItems.push({ ...selectedRestaurant, type: 'restaurant', totalCost: restaurantCost });
    remaining -= restaurantCost;
  
    const types = [
      { key: 'clothing', costField: 'cost', type: 'clothing' },
      { key: 'tamada', costField: 'cost', type: 'tamada' },
      { key: 'programs', costField: 'cost', type: 'program' },
      { key: 'traditionalGifts', costField: 'cost', type: 'traditionalGift' },
      { key: 'flowers', costField: 'cost', type: 'flowers' },
      { key: 'cakes', costField: 'cost', type: 'cake' },
      { key: 'alcohol', costField: 'cost', type: 'alcohol' },
      { key: 'transport', costField: 'cost', type: 'transport' },
    ];
  
    for (const { key, costField, type } of types) {
      const items = data[key].filter((item) => parseFloat(item[costField]) <= remaining);
  
      if (items.length > 0) {
        const sortedItems = items.sort((a, b) => parseFloat(a[costField]) - parseFloat(b[costField]));
        let selectedItem;
  
        if (priceFilter === 'min') {
          selectedItem = sortedItems[0];
        } else if (priceFilter === 'max') {
          selectedItem = sortedItems[sortedItems.length - 1];
        } else {
          selectedItem = sortedItems[Math.floor(sortedItems.length / 2)];
        }
  
        const cost = parseFloat(selectedItem[costField]);
        selectedItems.push({ ...selectedItem, type, totalCost: cost });
        remaining -= cost;
      }
    }
  
    setFilteredData(selectedItems);
    setRemainingBudget(remaining);
  };
  
  export const handleQuantityChange = ({
    itemKey,
    value,
    filteredData,
    setFilteredData,
    setQuantities,
    budget,
    setRemainingBudget,
  }) => {
    const filteredValue = value.replace(/[^0-9]/g, '');
    if (filteredValue === '' || parseFloat(filteredValue) >= 0) {
      setQuantities((prev) => ({ ...prev, [itemKey]: filteredValue }));
      const quantity = filteredValue === '' ? 0 : parseFloat(filteredValue);
  
      const updatedFilteredData = filteredData.map((item) => {
        const key = `${item.type}-${item.id}`;
        if (key === itemKey) {
          const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
          const totalCost = isNaN(quantity) || quantity > 1000 ? 0 : cost * quantity;
          return { ...item, totalCost };
        }
        return item;
      });
      setFilteredData(updatedFilteredData);
  
      const totalSpent = updatedFilteredData.reduce((sum, item) => sum + (item.totalCost || 0), 0);
      setRemainingBudget(parseFloat(budget) - totalSpent);
    }
  };