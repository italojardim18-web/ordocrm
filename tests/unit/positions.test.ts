import { describe, expect, it } from "vitest";
import {
  positionBetween,
  positionForBottom,
  positionForTop,
} from "@/lib/positions";

describe("posições fracionárias do Kanban", () => {
  it("coluna vazia recebe a posição inicial", () => {
    expect(positionBetween(null, null)).toBe(1000);
  });

  it("topo fica antes do primeiro card", () => {
    expect(positionForTop(1000)).toBe(0);
    expect(positionForTop(null)).toBe(1000);
  });

  it("fim fica depois do último card", () => {
    expect(positionForBottom(3000)).toBe(4000);
    expect(positionForBottom(null)).toBe(1000);
  });

  it("entre dois cards usa a média", () => {
    expect(positionBetween(1000, 2000)).toBe(1500);
    expect(positionBetween(1500, 2000)).toBe(1750);
  });

  it("mantém ordem estrita após inserções sucessivas", () => {
    let a = 1000;
    const b = 2000;
    for (let i = 0; i < 20; i++) {
      const mid = positionBetween(a, b);
      expect(mid).toBeGreaterThan(a);
      expect(mid).toBeLessThan(b);
      a = mid;
    }
  });
});
