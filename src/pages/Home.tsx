"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { List, Moon, Sun } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast, Toaster } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SetupDetailsModal } from "@/components/SetupDetailsModal";
import { RequiredField } from "@/components/RequiredField";

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [saveSetup, setSaveSetup] = useState(true);

  const [frontalWeightInput, setFrontalWeightInput] = useState("");
  const [compressionStiffness, setCompressionStiffness] = useState("");
  const [minReturnStiffness, setMinReturnStiffness] = useState("");
  const [maxReturnStiffness, setMaxReturnStiffness] = useState("");
  const [minAntiRollBar, setMinAntiRollBar] = useState("");
  const [maxAntiRollBar, setMaxAntiRollBar] = useState("");
  const [minSprings, setMinSprings] = useState("");
  const [maxSprings, setMaxSprings] = useState("");
  const [setupName, setSetupName] = useState("");

  const [result, setResult] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedSetups, setSavedSetups] = useState<
    Array<{ name: string; data: any }>
  >([]);
  const [selectedSetup, setSelectedSetup] = useState<any>(null);
  const [showSavedSetups, setShowSavedSetups] = useState(false);
  const [isCalculationResult, setIsCalculationResult] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  useEffect(() => {
    if (showSavedSetups) {
      const setups = Object.keys(localStorage)
        .filter((key) => key.startsWith("fsetup_"))
        .map((key) => ({
          name: key.split("fsetup_")[1],
          data: JSON.parse(localStorage.getItem(key)!),
        }));
      setSavedSetups(setups);
    }
  }, [showSavedSetups]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const tuneFormula = (maxValue: number, minValue: number, weight: number) => {
    return (maxValue - minValue) * weight + minValue;
  };

  const handleCalculate = () => {
    if (
      !frontalWeightInput ||
      !compressionStiffness ||
      !minReturnStiffness ||
      !maxReturnStiffness ||
      !minAntiRollBar ||
      !maxAntiRollBar ||
      !minSprings ||
      !maxSprings ||
      (saveSetup && !setupName)
    ) {
      return toast.error(
        "Preencha todos os campos obrigatórios do formulário!"
      );
    }

    const frontalWeight = parseFloat(frontalWeightInput) || 0;
    const rearWeight = 100 - frontalWeight;
    console.log("FRONTAL WEIGHT: ", frontalWeight, "REAR WEIGHT: ", rearWeight);

    const compression = (parseFloat(compressionStiffness) || 0) / 100;
    const minReturn = parseFloat(minReturnStiffness) || 0;
    const maxReturn = parseFloat(maxReturnStiffness) || 0;
    const minARB = parseFloat(minAntiRollBar) || 0;
    const maxARB = parseFloat(maxAntiRollBar) || 0;
    const minSpr = parseFloat(minSprings) || 0;
    const maxSpr = parseFloat(maxSprings) || 0;

    const frontReturnStiffness = tuneFormula(
      maxReturn,
      minReturn,
      frontalWeight / 100
    );
    const rearReturnStiffness = tuneFormula(
      maxReturn,
      minReturn,
      rearWeight / 100
    );
    const frontCompressionStiffness = frontReturnStiffness * compression;
    const rearCompressionStiffness = rearReturnStiffness * compression;
    const frontARB = tuneFormula(maxARB, minARB, frontalWeight / 100);
    const rearARB = tuneFormula(maxARB, minARB, rearWeight / 100);
    const frontSprings = tuneFormula(maxSpr, minSpr, frontalWeight / 100);
    const rearSprings = tuneFormula(maxSpr, minSpr, rearWeight / 100);

    const result = {
      frontReturnStiffness,
      rearReturnStiffness,
      frontCompressionStiffness,
      rearCompressionStiffness,
      frontARB,
      rearARB,
      frontSprings,
      rearSprings,
    };

    setResult(result);
    setIsModalOpen(true);
    setIsCalculationResult(true);

    if (saveSetup && setupName) {
      localStorage.setItem(`fsetup_${setupName}`, JSON.stringify(result));
    }
  };

  const handleDeleteSetup = (setupName: string) => {
    if (confirm(`Tem certeza que deseja deletar o setup "${setupName}"?`)) {
      localStorage.removeItem(`fsetup_${setupName}`);
      setSavedSetups((prev) =>
        prev.filter((setup) => setup.name !== setupName)
      );
      toast.success("Setup deletado com sucesso!");
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-6 gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label={
              theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"
            }
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSavedSetups(true)}
            aria-label="Ver setups salvos"
          >
            <List className="h-5 w-5" />
          </Button>
        </div>

        <Sheet open={showSavedSetups} onOpenChange={setShowSavedSetups}>
          <SheetContent side="right" className="w-[400px]">
            <SheetHeader>
              <SheetTitle>Setups Salvos</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-2 p-1">
              {savedSetups.map((setup) => (
                <div
                  key={setup.name}
                  className="flex justify-between items-center p-2 border rounded-lg"
                >
                  <span className="truncate">{setup.name}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedSetup(setup.data);
                        setIsModalOpen(true);
                        setIsCalculationResult(false);
                      }}
                    >
                      Detalhes
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteSetup(setup.name)}
                    >
                      Deletar
                    </Button>
                  </div>
                </div>
              ))}
              {savedSetups.length === 0 && (
                <p className="text-muted-foreground text-center">
                  Nenhum setup salvo
                </p>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Card className="max-w-md mx-auto dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl">Ajustes de Tunagem</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para calcular os ajustes de tunagem de
              amortecimento, molas e barras estabilizadoras do seu carro no FH4
              ou FM8.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="frontal-weight">
                <RequiredField>Distribuição de Peso Frontal (%)</RequiredField>
              </Label>
              <Input
                type="number"
                id="frontal-weight"
                value={frontalWeightInput}
                onChange={(e) => setFrontalWeightInput(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compression-stiffness">
                <RequiredField>
                  Rigidez de Compressão Desejada (50% à 75%)
                </RequiredField>
              </Label>
              <Input
                type="number"
                id="compression-stiffness"
                value={compressionStiffness}
                onChange={(e) => setCompressionStiffness(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="return-stiffness">
                <RequiredField>Rigidez de Retorno</RequiredField>
              </Label>
              <div id="return-stiffness" className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  id="minimum-return-stiffness"
                  placeholder="Mínima"
                  value={minReturnStiffness}
                  onChange={(e) => setMinReturnStiffness(e.target.value)}
                />
                <Input
                  type="number"
                  id="maximum-return-stiffness"
                  placeholder="Máxima"
                  value={maxReturnStiffness}
                  onChange={(e) => setMaxReturnStiffness(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="anti-roll-bar">
                <RequiredField>Barra Estabilizadora</RequiredField>
              </Label>
              <div id="anti-roll-bar" className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  id="minimum-anti-roll-bar"
                  placeholder="Mínima"
                  value={minAntiRollBar}
                  onChange={(e) => setMinAntiRollBar(e.target.value)}
                />
                <Input
                  type="number"
                  id="maximum-anti-roll-bar"
                  placeholder="Máxima"
                  value={maxAntiRollBar}
                  onChange={(e) => setMaxAntiRollBar(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="springs">
                <RequiredField>Molas</RequiredField>
              </Label>
              <div id="springs" className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  id="minimum-springs"
                  placeholder="Mínima"
                  value={minSprings}
                  onChange={(e) => setMinSprings(e.target.value)}
                />
                <Input
                  type="number"
                  id="maximum-springs"
                  placeholder="Máxima"
                  value={maxSprings}
                  onChange={(e) => setMaxSprings(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="save-setup"
                checked={saveSetup}
                onCheckedChange={(checked) => setSaveSetup(!!checked)}
              />
              <label
                htmlFor="save-setup"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Salvar Setup de Tunagem
              </label>
            </div>
            {saveSetup && (
              <div id="setup-name-div" className="space-y-2">
                <Label htmlFor="setup-name">
                  <RequiredField>Nome do Setup</RequiredField>
                </Label>
                <Input
                  type="text"
                  id="setup-name"
                  value={setupName}
                  onChange={(e) => setSetupName(e.target.value)}
                />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleCalculate}>
              Calcular
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Toaster position="top-right" richColors closeButton />

      <SetupDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setupData={isCalculationResult ? result : selectedSetup}
        isCalculationResult={isCalculationResult}
      />
    </div>
  );
}
