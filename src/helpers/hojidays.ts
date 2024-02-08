const dates = [
    { "name": "Ano Novo", "date": "2024-01-01" },
    { "name": "Ponte do Dia do Carnaval", "date": "2024-02-12" },
    { "name": "Carnaval", "date": "2024-02-13" },
    { "name": "Dia da Mulher", "date": "2024-03-08" },
    { "name": "Ponte do Dia da Paz", "date": "2024-04-04" },
    { "name": "Dia da Paz", "date": "2024-04-05" },
    { "name": "Dia do Trabalhador", "date": "2024-05-01" },
    { "name": "Ponte do Dia da Independência", "date": "2024-09-16" },
    { "name": "Dia da Independência", "date": "2024-09-17" },
    { "name": "Dia da Independência", "date": "2024-11-11" },
    { "name": "Natal", "date": "2024-12-25" }
  ]
  
  
  const holydays = dates;
  const holydaysDates = { holydays: dates?.map(({ date }: any) => date) }
  
  export { holydays, holydaysDates }