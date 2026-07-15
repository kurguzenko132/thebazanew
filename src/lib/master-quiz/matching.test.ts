import assert from "node:assert/strict";
import test from "node:test";
import { demoQuizConfig } from "./demo";
import { calculateMasterRecommendations, validateAnswers } from "./matching";

const baseAnswers = { service: ["haircut"], interests: ["cars", "sport"], lifestyle: ["cars"], communication: ["quiet"], personality: ["calm"], priority: ["precision"] };

test("one master with the highest score is returned", () => {
  const result = calculateMasterRecommendations(demoQuizConfig, baseAnswers);
  assert.equal(result.recommendations.length, 1);
  assert.equal(result.recommendations[0]?.name, "Дмитрий");
});

test("all masters with an equal maximum score are returned", () => {
  const config = structuredClone(demoQuizConfig);
  config.masters[1].tagWeights = { ...config.masters[0].tagWeights };
  config.masters[1].services = [...config.masters[0].services];
  const result = calculateMasterRecommendations(config, baseAnswers);
  assert.equal(result.tieCount, 2);
  assert.deepEqual(result.recommendations.map((item) => item.name).sort(), ["Дмитрий", "Максим"]);
});

test("a result exists even when every active master has a small score", () => {
  const result = calculateMasterRecommendations(demoQuizConfig, { service: ["haircut"], communication: ["active"], priority: ["price"] });
  assert.ok(result.recommendations.length > 0);
});

test("hard filter excludes masters who do not provide requested service", () => {
  const result = calculateMasterRecommendations(demoQuizConfig, { ...baseAnswers, service: ["shaving"] });
  assert.deepEqual(result.recommendations.map((item) => item.name), ["Иван"]);
});

test("required answers and selection limits are validated on the server", () => {
  assert.match(validateAnswers(demoQuizConfig, { service: ["haircut"] }) ?? "", /КАКОЕ ОБЩЕНИЕ/);
  assert.match(validateAnswers(demoQuizConfig, { ...baseAnswers, interests: ["cars", "sport", "business", "tech", "music", "movies"] }) ?? "", /не более 5/);
});
