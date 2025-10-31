// === Các Model ở thư mục gốc ===
import Document from "./document.model.js";
import DutySoldier from "./dutysoldier.model.js";
import InventoryItem from "./inventory.model.js";
import TargetDepartment from "./targetdepartment.model.js";
// File 'traning' ở thư mục gốc, tạm đặt tên là 'RootTraining'
import RootTraining from "./traning.models.js";

// === Các Model trong thư mục 'solider' ===
import AwardsDiscipline from "./soldier/awardsdiscipline.model.js";
import Department from "./soldier/department.model.js";
import Family from "./soldier/family.model.js";
import RelatedFiles from "./soldier/relatedFiles.model.js";
import ServiceHistory from "./soldier/serviceHistory.model.js";
import Soldier from "./soldier/soldier.model.js";
// File 'traning' bên trong 'solider'
import Training from "./soldier/traning.models.js";

// Export tất cả ra dưới dạng một đối tượng default
const models = {
  Document,
  DutySoldier,
  InventoryItem,
  TargetDepartment,
  RootTraining,
  AwardsDiscipline,
  Department,
  Family,
  RelatedFiles,
  ServiceHistory,
  Soldier,
  Training,
};

export default models;
