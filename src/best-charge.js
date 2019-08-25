
let s1 = null;
let s2 = null;
function count(db, menu, promotions, index) {
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
            s1 = promotions[1].type + "(" + s.substring(0, s.length - 1) + ")，" + "省" + (tmpMoney - money) + "元";
          }
        }
      });
    });
    return money;
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
      s2 = promotions[0].type + "，" + "省6元";
      return money;
    } else {
      return money;
    }
  }

  return 0;
}

function bestCharge(selectedItems) {
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

  let db = loadAllItems();
  let promotions = loadPromotions();
  let receipt = "============= 订餐明细 =============\n";

  menu.forEach(food => {
    db.forEach(element => {
      if (food.id === element.id) {
        receipt += element.name + " x " + food.count + " = " + (element.price * food.count) + "元\n";
      }
    });
  });
  receipt += "-----------------------------------\n";
  let m1 = count(db, menu, promotions, 1);
  let m2 = count(db, menu, promotions, 2);


  if (m1 < m2) {
    receipt += "使用优惠:\n";
    receipt += s1 + "\n"; \
    receipt += "-----------------------------------\n";
    receipt += "总计：" + m1 + "元\n" + "===================================";
  } else {
    if (s2 != null) {
      receipt += "使用优惠:\n";
      receipt += s2 + "\n";
      receipt += "-----------------------------------\n";
    }
    receipt += "总计：" + m2 + "元\n" + "===================================";
  }

  return receipt;
}
