
function countDiscount(menu, index) {
  let promotions = loadPromotions();
  let db = loadAllItems();
  let promotion = null;
  let money = 0;
  if (index == 1) {
    let tmpMoney = 0;
    let s = "";
    menu.forEach(food => {
      db.forEach(element => {
        if (food.id === element.id) {
          tmpMoney += element.price * food.count;
          if (element.id == "ITEM0001" || element.id == "ITEM0022") {
            s += element.name.concat("，");
            money += (element.price / 2) * food.count;
          } else {
            money += element.price * food.count;
          }
          if (s.length > 0) {
            promotion = promotions[1].type + "(" + s.substring(0, s.length - 1) + ")，" + "省" + (tmpMoney - money) + "元";
          }
        }
      });
    });

    let ret = {
      money: money,
      promotion: promotion
    };

    return ret;
  } else if (index == 2) {
    menu.forEach(food => {
      db.forEach(element => {
        if (food.id === element.id) {
          money += element.price * food.count;
        }
      });
    });

    if (money >= 30) {
      money -= 6;
      promotion = promotions[0].type + "，" + "省6元";
    }

    let ret = {
      money: money,
      promotion: promotion
    };

    return ret;
  }

  return 0;
}

//计算每个菜品的数量
function calculateFoodCount(selectedItems) {
  let menu = [];

  selectedItems.forEach(element => {
    let id = element.substring(0, 8);
    let count = parseInt(element.substring(11));
    menu.push(
      {
        id: id,
        count: count
      }
    );
  });

  return menu;
}

//计算订单的明细
function calculateOrderDetails(menu) {
  let db = loadAllItems();
  let receipt = "============= 订餐明细 =============\n";

  menu.forEach(food => {
    db.forEach(element => {
      if (food.id === element.id) {
        receipt += element.name + " x " + food.count + " = " + (element.price * food.count) + "元\n";
      }
    });
  });
  receipt += "-----------------------------------\n";

  return receipt;
}

function getBestCharge(discount1, discount2, receipt) {

  if (discount1.money < discount2.money) {
    receipt += "使用优惠:\n";
    receipt += discount1.promotion + "\n";
    receipt += "-----------------------------------\n";
    receipt += "总计：" + discount1.money + "元\n" + "===================================";
  } else {
    if (discount2.promotion != null) {
      receipt += "使用优惠:\n";
      receipt += discount2.promotion + "\n";
      receipt += "-----------------------------------\n";
    }
    receipt += "总计：" + discount2.money + "元\n" + "===================================";
  }

  return receipt;
}

function bestCharge(selectedItems) {
  let menu = calculateFoodCount(selectedItems);
  let receipt = calculateOrderDetails(menu)

  //计算打折后的价格
  let discount1 = countDiscount(menu, 1);
  let discount2 = countDiscount(menu, 2);

  //得到最优的结果
  receipt = getBestCharge(discount1, discount2, receipt);

  return receipt;
}
