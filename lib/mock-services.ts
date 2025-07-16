// Мок-сервисы для демонстрации работы приложения
// В реальном использовании замените на настоящие сервисы

export class MockGigaChatService {
  async analyzeTask(taskDescription: string): Promise<string> {
    // Имитируем задержку API
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return `## Анализ задачи: ${taskDescription}

### 1. Анализ задачи
Задача требует создания скрипта для обработки данных. Необходимо определить:
- Тип входных данных
- Формат вывода
- Обработка ошибок
- Валидация входных параметров

### 2. Необходимые библиотеки и зависимости
- pandas - для работы с данными
- openpyxl - для чтения Excel файлов
- argparse - для обработки аргументов командной строки
- logging - для логирования

### 3. Пошаговый план реализации
1. Создание функции для чтения Excel файла
2. Валидация входных параметров
3. Извлечение данных из указанной колонки
4. Вычисление среднего значения
5. Обработка ошибок и исключений
6. Вывод результата

### 4. Ожидаемый результат
Скрипт должен принимать путь к Excel файлу и название колонки, возвращать среднее значение по этой колонке.

### 5. Возможные проблемы и их решения
- Файл не существует: добавить проверку существования файла
- Колонка не найдена: валидация названий колонок
- Пустые значения: обработка NaN значений
- Нечисловые данные: фильтрация или преобразование типов`;
  }

  async generateCode(
    taskDescription: string,
    analysis: string
  ): Promise<string> {
    // Имитируем задержку API
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return `#!/usr/bin/env python3
"""
Excel Data Processor
===================

Task: ${taskDescription}

This script reads an Excel file and calculates the average value
of a specified column.

Dependencies:
- pandas
- openpyxl
- argparse
- logging

Usage:
    python excel_processor.py --file data.xlsx --column "Sales"
"""

import pandas as pd
import argparse
import logging
import sys
from pathlib import Path

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def read_excel_file(file_path: str) -> pd.DataFrame:
    """
    Читает Excel файл и возвращает DataFrame.
    
    Args:
        file_path (str): Путь к Excel файлу
        
    Returns:
        pd.DataFrame: Данные из файла
        
    Raises:
        FileNotFoundError: Если файл не найден
        ValueError: Если файл не является Excel файлом
    """
    try:
        if not Path(file_path).exists():
            raise FileNotFoundError(f"Файл не найден: {file_path}")
        
        logger.info(f"Читаем файл: {file_path}")
        df = pd.read_excel(file_path)
        logger.info(f"Успешно загружено {len(df)} строк и {len(df.columns)} колонок")
        return df
        
    except Exception as e:
        logger.error(f"Ошибка при чтении файла: {e}")
        raise

def validate_column(df: pd.DataFrame, column_name: str) -> bool:
    """
    Проверяет существование колонки в DataFrame.
    
    Args:
        df (pd.DataFrame): DataFrame для проверки
        column_name (str): Название колонки
        
    Returns:
        bool: True если колонка существует
    """
    if column_name not in df.columns:
        logger.error(f"Колонка '{column_name}' не найдена. Доступные колонки: {list(df.columns)}")
        return False
    return True

def calculate_average(df: pd.DataFrame, column_name: str) -> float:
    """
    Вычисляет среднее значение по указанной колонке.
    
    Args:
        df (pd.DataFrame): DataFrame с данными
        column_name (str): Название колонки
        
    Returns:
        float: Среднее значение
    """
    try:
        # Удаляем пустые значения
        clean_data = df[column_name].dropna()
        
        if len(clean_data) == 0:
            raise ValueError(f"Колонка '{column_name}' не содержит числовых данных")
        
        # Проверяем, что данные числовые
        if not pd.api.types.is_numeric_dtype(clean_data):
            logger.warning(f"Колонка '{column_name}' содержит нечисловые данные. Попытка преобразования...")
            clean_data = pd.to_numeric(clean_data, errors='coerce').dropna()
            
            if len(clean_data) == 0:
                raise ValueError(f"Не удалось преобразовать данные в числовой формат")
        
        average = clean_data.mean()
        logger.info(f"Среднее значение по колонке '{column_name}': {average:.2f}")
        return average
        
    except Exception as e:
        logger.error(f"Ошибка при вычислении среднего значения: {e}")
        raise

def main():
    """Основная функция программы."""
    parser = argparse.ArgumentParser(
        description='Вычисляет среднее значение по указанной колонке Excel файла'
    )
    parser.add_argument(
        '--file', 
        required=True, 
        help='Путь к Excel файлу'
    )
    parser.add_argument(
        '--column', 
        required=True, 
        help='Название колонки для анализа'
    )
    
    args = parser.parse_args()
    
    try:
        # Читаем файл
        df = read_excel_file(args.file)
        
        # Проверяем колонку
        if not validate_column(df, args.column):
            sys.exit(1)
        
        # Вычисляем среднее значение
        average = calculate_average(df, args.column)
        
        # Выводим результат
        print(f"\\n📊 Результат анализа:")
        print(f"Файл: {args.file}")
        print(f"Колонка: {args.column}")
        print(f"Среднее значение: {average:.2f}")
        print(f"Количество обработанных строк: {len(df)}")
        
    except Exception as e:
        logger.error(f"Критическая ошибка: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()`;
  }
}

export class MockGitHubService {
  async createPullRequest(data: any) {
    // Имитируем задержку API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const { taskDescription, fileName } = data;

    return {
      title: `🤖 AI Generated: ${taskDescription.slice(0, 60)}...`,
      description: `AI generated code for task: ${taskDescription}`,
      url: `https://github.com/example/repo/pull/123`,
      branch: `feature/ai-generated-${fileName.replace(".py", "")}`,
      number: 123,
    };
  }
}
