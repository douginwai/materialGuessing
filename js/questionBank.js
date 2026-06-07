/**
 * 题库数据 - 50道题目
 */
module.exports = [
  // ========== 饮料区 (10题) ==========
  {
    id: 'beverage_001', category: 'beverage', difficulty: 1,
    ingredients: ['水', '白砂糖', '果葡糖浆', '二氧化碳', '焦糖色', '磷酸', '咖啡因', '食用香精'],
    options: ['百事可乐', '可口可乐', '雪碧', '芬达'], answer: 1,
    foxComment: '可乐的区别？配方99%一样，剩下1%是两家公司的倔强。',
    knowledge: '一罐330ml可乐含糖约35g，接近WHO建议的每日糖摄入上限。'
  },
  {
    id: 'beverage_002', category: 'beverage', difficulty: 1,
    ingredients: ['水', '白砂糖', '果葡糖浆', '柠檬酸', '食用香精', '柠檬酸钠', '维生素C', 'β-胡萝卜素'],
    options: ['鲜榨橙汁', '橙味汽水', '果粒橙', '柠檬茶'], answer: 1,
    foxComment: '鲜榨橙汁哪有这么多添加剂，你当橙子不要面子啊？',
    knowledge: '果葡糖浆是饮料中最常见的甜味剂，成本只有蔗糖的60%。'
  },
  {
    id: 'beverage_003', category: 'beverage', difficulty: 1,
    ingredients: ['水', '白砂糖', '椰浆', '酪蛋白酸钠', '单硬脂酸甘油酯', '食用香精'],
    options: ['椰子水', '椰树牌椰汁', '旺仔牛奶', '豆奶'], answer: 1,
    foxComment: '白色液体不一定是牛奶，也可能是椰汁加了乳化剂。',
    knowledge: '酪蛋白酸钠是一种乳化剂，让椰浆和水不分离。'
  },
  {
    id: 'beverage_004', category: 'beverage', difficulty: 1,
    ingredients: ['水', '白砂糖', '红茶', '柠檬酸', '柠檬酸钠', '维生素C', '食用香精'],
    options: ['奶茶', '冰红茶', '乌龙茶', '柠檬水'], answer: 1,
    foxComment: '冰红茶里的茶含量…你猜？反正够它叫"茶"就行。',
    knowledge: '冰红茶中的茶多酚含量远低于泡茶，主要甜味来自白砂糖。'
  },
  {
    id: 'beverage_005', category: 'beverage', difficulty: 1,
    ingredients: ['水', '白砂糖', '柠檬酸', '柠檬酸钠', '氯化钠', '氯化钾', '维生素C', '维生素B6'],
    options: ['矿泉水', '运动饮料', '气泡水', '蜂蜜水'], answer: 1,
    foxComment: '喝完运动饮料才去运动？那你就白运动了。',
    knowledge: '运动饮料含电解质和糖，适合大量出汗后补充。'
  },
  {
    id: 'beverage_006', category: 'beverage', difficulty: 1,
    ingredients: ['水', '二氧化碳', '白砂糖', '柠檬酸', '食用香精'],
    options: ['苏打水', '雪碧', '可乐', '巴黎水'], answer: 1,
    foxComment: '透明气泡水+糖+香精=雪碧，和"天然"没有半毛关系。',
    knowledge: '无糖版用代糖替代白砂糖，但柠檬酸和香精依然存在。'
  },
  {
    id: 'beverage_007', category: 'beverage', difficulty: 1,
    ingredients: ['水', '浓缩苹果汁', '果葡糖浆', '柠檬酸', '维生素C'],
    options: ['纯苹果汁', '苹果味饮料', '苹果醋', '鲜榨苹果汁'], answer: 1,
    foxComment: '"浓缩苹果汁"≠苹果汁，就像"浓缩咖啡"≠咖啡豆。',
    knowledge: '浓缩果汁经脱水再加水还原，维生素C大量流失。'
  },
  {
    id: 'beverage_008', category: 'beverage', difficulty: 1,
    ingredients: ['水', '白砂糖', '全脂奶粉', '红茶', '乳化剂', '稳定剂', '食用香精'],
    options: ['纯牛奶', '瓶装奶茶', '拿铁咖啡', '豆浆'], answer: 1,
    foxComment: '瓶装奶茶的奶不是现挤的，茶不是现泡的，但糖是现加的。',
    knowledge: '瓶装奶茶含糖量约50g/瓶，一杯即可超出每日推荐摄入量。'
  },
  {
    id: 'beverage_009', category: 'beverage', difficulty: 1,
    ingredients: ['水', '乳粉', '白砂糖', '乳酸', '柠檬酸钠', '食用香精', '果胶'],
    options: ['纯酸奶', '乳酸菌饮料', '鲜牛奶', '奶酪'], answer: 1,
    foxComment: '乳酸菌饮料不是酸奶！就像黄瓜不是水果。',
    knowledge: '乳酸菌饮料蛋白质含量远低于酸奶，主要成分是水和糖。'
  },
  {
    id: 'beverage_010', category: 'beverage', difficulty: 1,
    ingredients: ['水', '速溶咖啡', '白砂糖', '植脂末', '食用香精', '酪蛋白酸钠'],
    options: ['美式咖啡', '三合一速溶咖啡', '拿铁', '卡布奇诺'], answer: 1,
    foxComment: '植脂末里可能有反式脂肪酸，你喝的不是咖啡，是化学课。',
    knowledge: '植脂末含氢化植物油，可能含反式脂肪酸。'
  },

  // ========== 零食区 (12题) ==========
  {
    id: 'snack_001', category: 'snack', difficulty: 2,
    ingredients: ['马铃薯', '植物油', '白砂糖', '食用盐', '谷氨酸钠', '食用香精'],
    options: ['薯片', '薯条', '虾条', '洋葱圈'], answer: 0,
    foxComment: '薯片的油含量≈你上个月的体重增长曲线。',
    knowledge: '薯片的脂肪含量高达30%-40%。'
  },
  {
    id: 'snack_002', category: 'snack', difficulty: 2,
    ingredients: ['小麦粉', '白砂糖', '棕榈油', '可可粉', '乳清粉', '磷脂', '膨松剂'],
    options: ['威化饼干', '黑巧克力', '夹心曲奇', '司康'], answer: 0,
    foxComment: '威化饼干的层数=你吃它时内疚的层数。',
    knowledge: '威化饼干的糖和棕榈油含量极高。'
  },
  {
    id: 'snack_003', category: 'snack', difficulty: 2,
    ingredients: ['小麦粉', '植物油', '辣椒', '花椒', '食用盐', '白砂糖', '谷氨酸钠'],
    options: ['辣条', '薯条', '方便面', '饼干'], answer: 0,
    foxComment: '辣条的包装袋上印的是"调味面制品"，不敢叫食品。',
    knowledge: '辣条高油高盐高辣，一包钠含量可达每日推荐量的60%。'
  },
  {
    id: 'snack_004', category: 'snack', difficulty: 2,
    ingredients: ['白砂糖', '葡萄糖浆', '氢化植物油', '乳清粉', '可可脂', '磷脂'],
    options: ['黑巧克力', '代可可脂巧克力', '生巧', '巧克力酱'], answer: 1,
    foxComment: '代可可脂≈假巧克力，和人造奶油是亲兄弟。',
    knowledge: '代可可脂由氢化植物油制成，可能含反式脂肪酸。'
  },
  {
    id: 'snack_005', category: 'snack', difficulty: 2,
    ingredients: ['水', '白砂糖', '葡萄糖浆', '果胶', '柠檬酸', '柠檬酸钠', '食用香精', '色素'],
    options: ['果冻', '软糖', '布丁', '水果冻干'], answer: 0,
    foxComment: '果冻里没有水果，有的是果胶+色素+香精的化学组合。',
    knowledge: '果冻的主要成分是水和糖，果胶来自植物提取。'
  },
  {
    id: 'snack_006', category: 'snack', difficulty: 2,
    ingredients: ['小麦粉', '植物油', '食用盐', '谷氨酸钠', '洋葱粉', '酸水解植物蛋白'],
    options: ['洋葱圈', '薯片', '虾片', '玉米脆'], answer: 0,
    foxComment: '洋葱圈里没有洋葱，就像老婆饼里没有老婆。',
    knowledge: '洋葱圈用洋葱粉调味，主要成分是面粉和油。'
  },
  {
    id: 'snack_007', category: 'snack', difficulty: 2,
    ingredients: ['玉米', '植物油', '食用盐', '白砂糖', '葡萄糖', '芝士粉'],
    options: ['玉米片', '薯片', '爆米花', '米饼'], answer: 0,
    foxComment: '玉米片≠健康粗粮，油和盐的分量让你怀疑人生。',
    knowledge: '玉米片经过油炸，脂肪含量和薯片不相上下。'
  },
  {
    id: 'snack_008', category: 'snack', difficulty: 2,
    ingredients: ['白砂糖', '葡萄糖浆', '改性淀粉', '明胶', '柠檬酸', '食用香精', '色素'],
    options: ['棉花糖', '软糖', '果冻', '奶糖'], answer: 1,
    foxComment: '软糖的主要成分是糖+胶，和营养价值无关。',
    knowledge: '软糖的明胶来自动物皮骨。'
  },
  {
    id: 'snack_009', category: 'snack', difficulty: 2,
    ingredients: ['小麦粉', '白砂糖', '起酥油', '奶油', '食用盐', '膨松剂'],
    options: ['牛角包', '苏打饼干', '蛋挞皮', '桃酥'], answer: 3,
    foxComment: '桃酥咬一口掉一地渣，咬两口血糖往上蹿。',
    knowledge: '桃酥的油脂含量可高达30%。'
  },
  {
    id: 'snack_010', category: 'snack', difficulty: 2,
    ingredients: ['小麦粉', '植物油', '白砂糖', '麦芽糖', '芝麻', '食用盐'],
    options: ['麻花', '油条', '饼干', '面包'], answer: 0,
    foxComment: '麻花的热量=一根就够你跑步半小时。',
    knowledge: '麻花经油炸制成，外裹糖，糖油混合物是热量炸弹。'
  },
  {
    id: 'snack_011', category: 'snack', difficulty: 2,
    ingredients: ['水', '白砂糖', '葡萄糖浆', '乳粉', '可可脂', '磷脂', '食用盐'],
    options: ['炼乳', '巧克力酱', '花生酱', '芝麻酱'], answer: 1,
    foxComment: '巧克力酱的第一成分是糖，巧克力只是配角。',
    knowledge: '市售巧克力酱含糖量超过50%。'
  },
  {
    id: 'snack_012', category: 'snack', difficulty: 2,
    ingredients: ['小麦粉', '白砂糖', '棕榈油', '麦芽提取物', '乳清粉', '食用盐', '色素'],
    options: ['全麦饼干', '奶油夹心饼干', '消化饼', '苏打饼'], answer: 1,
    foxComment: '奶油夹心的"奶油"≈油脂+糖+香精，不是你想的那个奶油。',
    knowledge: '夹心饼干的夹心是糖粉和油脂混合。'
  },

  // ========== 速食区 (8题) ==========
  {
    id: 'instant_001', category: 'instant', difficulty: 2,
    ingredients: ['小麦粉', '棕榈油', '食用盐', '谷氨酸钠', '碳酸钾', '瓜尔胶'],
    options: ['挂面', '方便面', '米粉', '意大利面'], answer: 1,
    foxComment: '方便面可以天天吃吗？可以的，只要你愿意天天去医院。',
    knowledge: '一包方便面钠含量约2300mg，已达每日推荐摄入量。'
  },
  {
    id: 'instant_002', category: 'instant', difficulty: 2,
    ingredients: ['鸡肉', '水', '淀粉', '白砂糖', '食用盐', '谷氨酸钠', '香辛料', '色素'],
    options: ['鸡胸肉', '火腿肠', '鸡排', '鸡肉丸'], answer: 1,
    foxComment: '火腿肠的淀粉含量高到可以当馒头吃。',
    knowledge: '火腿肠的肉含量仅30%-60%。'
  },
  {
    id: 'instant_003', category: 'instant', difficulty: 2,
    ingredients: ['牛肉', '水', '白砂糖', '食用盐', '大豆蛋白', '香辛料', '亚硝酸钠'],
    options: ['鲜牛肉', '牛肉干', '午餐肉', '牛肉丸'], answer: 2,
    foxComment: '午餐肉的第一配料可能是猪肉或鸡肉，牛肉只是个名字。',
    knowledge: '午餐肉常添加亚硝酸钠作为防腐剂和发色剂。'
  },
  {
    id: 'instant_004', category: 'instant', difficulty: 2,
    ingredients: ['糯米', '猪肉', '水', '白砂糖', '食用盐', '酱油', '香辛料'],
    options: ['粽子', '烧卖', '糯米鸡', '肉丸'], answer: 0,
    foxComment: '粽子的热量≈你划龙舟半小时消耗的热量。',
    knowledge: '一个肉粽含油约10-15g，热量约400-500大卡。'
  },
  {
    id: 'instant_005', category: 'instant', difficulty: 2,
    ingredients: ['水', '白砂糖', '果葡糖浆', '柠檬酸', '维生素C', '食用盐'],
    options: ['果汁', '果味固体饮料', '蜂蜜', '糖浆'], answer: 1,
    foxComment: '固体饮料≈糖粉+香精，泡水喝等于喝糖水。',
    knowledge: '固体饮料冲调后营养成分极低。'
  },
  {
    id: 'instant_006', category: 'instant', difficulty: 2,
    ingredients: ['面粉', '水', '猪肉', '白菜', '食用盐', '白砂糖', '谷氨酸钠'],
    options: ['饺子', '馄饨', '烧卖', '包子'], answer: 0,
    foxComment: '速冻饺子和妈妈包的饺子，差别比你和爱因斯坦还大。',
    knowledge: '速冻饺子的肉含量通常在30%左右。'
  },
  {
    id: 'instant_007', category: 'instant', difficulty: 2,
    ingredients: ['大米', '植物油', '食用盐', '白砂糖', '谷氨酸钠', '香辛料'],
    options: ['米饭', '自热米饭', '米粉', '米线'], answer: 1,
    foxComment: '自热米饭的米是"重组米"，和你家的米不是一个物种。',
    knowledge: '自热米饭使用重组米（大米粉碎后加添加剂重新造粒）。'
  },
  {
    id: 'instant_008', category: 'instant', difficulty: 2,
    ingredients: ['小麦粉', '猪油', '食用盐', '白砂糖', '香葱', '谷氨酸钠'],
    options: ['苏打饼干', '葱油拌面酱', '肉松饼', '桃酥'], answer: 1,
    foxComment: '猪油+香葱+味精=三大灵魂，但加起来也是三大健康杀手。',
    knowledge: '葱油酱包中猪油含量极高。'
  },

  // ========== 调味区 (6题) ==========
  {
    id: 'condiment_001', category: 'condiment', difficulty: 3,
    ingredients: ['番茄', '白砂糖', '酿造醋', '食用盐', '洋葱粉'],
    options: ['番茄酱', '番茄沙司', '番茄膏', '意面酱'], answer: 1,
    foxComment: '番茄酱和番茄沙司的区别？糖的含量差了三条街。',
    knowledge: '番茄沙司比番茄酱含糖量高很多。'
  },
  {
    id: 'condiment_002', category: 'condiment', difficulty: 3,
    ingredients: ['白砂糖', '酿造酱油', '水', '食用盐', '小麦粉', '谷氨酸钠', '焦糖色'],
    options: ['老抽', '生抽', '蚝油', '甜面酱'], answer: 2,
    foxComment: '蚝油里真的有蚝吗？有——蚝汁提取物，排在第五位之后。',
    knowledge: '蚝油的主要成分是糖、盐和增味剂。'
  },
  {
    id: 'condiment_003', category: 'condiment', difficulty: 3,
    ingredients: ['水', '大豆', '小麦', '食用盐', '白砂糖', '酒精', '谷氨酸钠'],
    options: ['老抽', '生抽', '酱油膏', '蒸鱼豉油'], answer: 1,
    foxComment: '生抽用来调味，老抽用来上色。',
    knowledge: '生抽颜色浅、咸味重，适合炒菜调味。'
  },
  {
    id: 'condiment_004', category: 'condiment', difficulty: 3,
    ingredients: ['水', '白砂糖', '食用盐', '酸水解植物蛋白', '谷氨酸钠', '焦糖色'],
    options: ['蚝油', '味极鲜', '鱼露', '虾酱'], answer: 1,
    foxComment: '味极鲜的美味来自味精（谷氨酸钠），不是手艺。',
    knowledge: '味极鲜就是加了大量增鲜剂的酱油。'
  },
  {
    id: 'condiment_005', category: 'condiment', difficulty: 3,
    ingredients: ['辣椒', '水', '食用盐', '白砂糖', '大蒜', '谷氨酸钠', '柠檬酸'],
    options: ['辣椒酱', '剁辣椒', '辣椒油', '老干妈'], answer: 3,
    foxComment: '老干妈征服世界的秘诀？油+盐+辣椒+味精。朴实无华。',
    knowledge: '老干妈的成分非常简单。'
  },
  {
    id: 'condiment_006', category: 'condiment', difficulty: 3,
    ingredients: ['水', '白砂糖', '番茄', '食用盐', '洋葱', '柠檬酸', '香辛料'],
    options: ['番茄酱', '番茄膏', '番茄沙司', '意式番茄酱'], answer: 3,
    foxComment: '意式番茄酱≈番茄+香料+糖。',
    knowledge: '意式番茄酱更多香料，适合做西式料理。'
  },

  // ========== 冰淇淋区 (6题) ==========
  {
    id: 'icecream_001', category: 'icecream', difficulty: 1,
    ingredients: ['水', '白砂糖', '乳粉', '棕榈油', '葡萄糖浆', '乳化剂', '稳定剂'],
    options: ['冰淇淋', '冰棍', '雪糕', '刨冰'], answer: 2,
    foxComment: '雪糕和冰淇淋的区别？看乳粉含量，雪糕更"水"。',
    knowledge: '国标规定，冰淇淋的乳脂含量需≥5%。'
  },
  {
    id: 'icecream_002', category: 'icecream', difficulty: 1,
    ingredients: ['水', '白砂糖', '葡萄糖浆', '柠檬酸', '食用香精', '色素'],
    options: ['雪糕', '冰淇淋', '冰棍', '奶昔'], answer: 2,
    foxComment: '冰棍≈冻起来的糖水，连奶都不加。',
    knowledge: '冰棍不含乳制品。'
  },
  {
    id: 'icecream_003', category: 'icecream', difficulty: 1,
    ingredients: ['水', '白砂糖', '乳粉', '奶油', '蛋黄', '食用香精'],
    options: ['冰淇淋', '冰棍', '布丁', '双皮奶'], answer: 0,
    foxComment: '加了蛋黄的冰淇淋才是正经冰淇淋。',
    knowledge: '蛋黄中的卵磷脂是天然乳化剂。'
  },
  {
    id: 'icecream_004', category: 'icecream', difficulty: 1,
    ingredients: ['水', '白砂糖', '绿豆', '淀粉'],
    options: ['绿豆汤', '绿豆冰棍', '绿豆糕', '绿豆沙'], answer: 1,
    foxComment: '绿豆冰棍的绿豆含量≈你在泳池里加的盐。',
    knowledge: '市售绿豆冰棍用绿豆汤+淀粉勾芡。'
  },
  {
    id: 'icecream_005', category: 'icecream', difficulty: 1,
    ingredients: ['水', '白砂糖', '乳粉', '棕榈油', '麦芽糖', '可可粉', '乳化剂'],
    options: ['巧克力冰淇淋', '巧克力雪糕', '巧克力冰棍', '热巧克力'], answer: 1,
    foxComment: '巧克力雪糕的"巧克力"大概率是代可可脂。',
    knowledge: '很多巧克力雪糕用代可可脂替代可可脂。'
  },
  {
    id: 'icecream_006', category: 'icecream', difficulty: 1,
    ingredients: ['水', '白砂糖', '西瓜汁', '葡萄糖浆', '柠檬酸', '色素'],
    options: ['鲜榨西瓜汁', '西瓜冰棍', '西瓜雪糕', '西瓜冰淇淋'], answer: 1,
    foxComment: '西瓜味冰棍的颜色比你昨天吃的西瓜还红——靠的是色素。',
    knowledge: '加工食品的红色常用诱惑红或甜菜红。'
  },

  // ========== 烘焙区 (4题) ==========
  {
    id: 'bakery_001', category: 'bakery', difficulty: 2,
    ingredients: ['小麦粉', '黄油', '白砂糖', '鸡蛋', '食用盐', '香草精'],
    options: ['曲奇饼干', '面包', '蛋糕', '松饼'], answer: 0,
    foxComment: '曲奇的黄油含量高到可以作为健身增肌的神器——玩笑。',
    knowledge: '正宗曲奇的黄油含量可达40%。'
  },
  {
    id: 'bakery_002', category: 'bakery', difficulty: 2,
    ingredients: ['小麦粉', '水', '白砂糖', '黄油', '鸡蛋', '酵母'],
    options: ['牛角包', '吐司面包', '法棍', '贝果'], answer: 0,
    foxComment: '牛角包用了大量黄油分层，咬一口掉渣。',
    knowledge: '牛角包使用起酥工艺，黄油层数可达几十层。'
  },
  {
    id: 'bakery_003', category: 'bakery', difficulty: 2,
    ingredients: ['小麦粉', '鸡蛋', '白砂糖', '植物油', '水', '膨松剂'],
    options: ['海绵蛋糕', '戚风蛋糕', '鸡蛋仔', '华夫饼'], answer: 0,
    foxComment: '海绵蛋糕的膨松靠打发的鸡蛋，不是靠泡打粉。',
    knowledge: '海绵蛋糕靠蛋液打发裹入空气。'
  },
  {
    id: 'bakery_004', category: 'bakery', difficulty: 2,
    ingredients: ['小麦粉', '猪油', '水', '白砂糖', '食用盐'],
    options: ['老婆饼', '蛋黄酥', '蛋挞', '桃酥'], answer: 0,
    foxComment: '老婆饼里没有老婆，但有猪油——多了也不行。',
    knowledge: '传统老婆饼用猪油起酥。'
  },

  // ========== 罐头区 (4题) ==========
  {
    id: 'canned_001', category: 'canned', difficulty: 3,
    ingredients: ['猪肉', '水', '淀粉', '食用盐', '白砂糖', '亚硝酸钠', '三聚磷酸钠'],
    options: ['午餐肉', '红烧肉罐头', '肉酱罐头', '腊肉'], answer: 0,
    foxComment: '午餐肉发明于大萧条时期，现在进化成了淀粉盛宴。',
    knowledge: '亚硝酸钠在午餐肉中起防腐和发色作用。'
  },
  {
    id: 'canned_002', category: 'canned', difficulty: 3,
    ingredients: ['鲮鱼', '植物油', '豆豉', '食用盐', '白砂糖'],
    options: ['油浸金枪鱼', '豆豉鲮鱼', '沙丁鱼罐头', '鱼子酱'], answer: 1,
    foxComment: '豆豉鲮鱼简直是广东人的"下饭神器"。',
    knowledge: '豆豉鲮鱼罐头是广东特色，鲮鱼先炸后腌。'
  },
  {
    id: 'canned_003', category: 'canned', difficulty: 3,
    ingredients: ['黄桃', '水', '白砂糖', '柠檬酸', '维生素C'],
    options: ['新鲜黄桃', '黄桃罐头', '桃汁', '黄桃果酱'], answer: 1,
    foxComment: '黄桃罐头泡在糖水里，比新鲜好吃但比新鲜胖人。',
    knowledge: '罐头水果经过高温杀菌，维生素C有所损失。'
  },
  {
    id: 'canned_004', category: 'canned', difficulty: 3,
    ingredients: ['竹笋', '水', '食用盐', '柠檬酸', '山梨酸钾'],
    options: ['酸笋', '竹笋罐头', '笋干', '泡椒竹笋'], answer: 1,
    foxComment: '竹笋罐头开盖即食，但别期待脆爽。',
    knowledge: '山梨酸钾是罐头中常用的防腐剂。'
  },
]
