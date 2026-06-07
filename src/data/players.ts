import type { Player } from '../types';

// Roster factory to ensure exactly 24 players per team
const fillSquad = (names: string[], positions: string[][], ratings: number[]): { names: string[], positions: string[][], ratings: number[] } => {
  const squadSize = 24;
  const currentSize = names.length;
  if (currentSize >= squadSize) return { names, positions, ratings };
  
  const filledNames = [...names, ...Array(squadSize - currentSize).fill('Legendary Depth')];
  const filledPositions = [...positions, ...Array(squadSize - currentSize).fill(['CM', 'CDM'])];
  const filledRatings = [...ratings, ...Array(squadSize - currentSize).fill(85)];
  return { names: filledNames, positions: filledPositions, ratings: filledRatings };
};

const SQUADS: Record<string, Record<string, { names: string[], positions: string[][], ratings: number[] }>> = {
  '1990s': {
    'Real Madrid': fillSquad(
      ['Raúl', 'Fernando Redondo', 'Fernando Hierro', 'Roberto Carlos', 'Bodo Illgner', 'Christian Panucci', 'Davor Šuker', 'Clarence Seedorf', 'Manuel Sanchís', 'Steve McManaman', 'Iván Zamorano', 'Guti', 'Fernando Morientes', 'Aitor Karanka', 'Manolo Sanchís', 'Víctor Sánchez', 'Jaime Sánchez', 'Pedro Jaro', 'Álvaro Benito', 'Javi Navarro', 'Dani García', 'José Emilio Amavisca', 'Perica Ognjenović', 'Iván Campo'],
      [['ST', 'CAM'], ['CM', 'CDM'], ['CB', 'CM'], ['LB'], ['GK'], ['RB'], ['ST'], ['CM'], ['CB'], ['RM', 'LM'], ['ST'], ['CAM', 'CM'], ['ST'], ['CB'], ['CB'], ['RW'], ['CDM'], ['GK'], ['LW'], ['CB'], ['ST'], ['LW'], ['LW'], ['CB']],
      [92, 91, 90, 91, 88, 87, 89, 90, 88, 89, 89, 86, 85, 84, 84, 83, 83, 82, 82, 82, 81, 81, 81, 80]
    ),
    'AC Milan': fillSquad(
      ['Paolo Maldini', 'Franco Baresi', 'Marco van Basten', 'Marcel Desailly', 'Dejan Savićević', 'George Weah', 'Demetrio Albertini', 'Sebastiano Rossi', 'Ruud Gullit', 'Frank Rijkaard', 'Alessandro Costacurta', 'Mauro Tassotti', 'Roberto Donadoni', 'Zvonimir Boban', 'Christian Panucci', 'Massimo Ambrosini', 'Jean-Pierre Papin', 'Brian Laudrup', 'Stefano Eranio', 'Filippo Galli', 'Daniele Massaro', 'Marco Simone', 'Ibrahim Ba', 'Jens Lehmann'],
      [['CB', 'LB'], ['CB'], ['ST'], ['CB', 'CDM'], ['CAM', 'RW'], ['ST'], ['CDM', 'CM'], ['GK'], ['CAM', 'ST'], ['CDM', 'CB'], ['CB'], ['RB'], ['RM', 'LM'], ['CAM'], ['RB'], ['CDM'], ['ST'], ['LW', 'RW'], ['RM'], ['CB'], ['ST'], ['ST'], ['RM'], ['GK']],
      [97, 96, 95, 94, 92, 93, 90, 89, 94, 93, 90, 88, 88, 89, 87, 87, 87, 86, 86, 85, 85, 85, 84, 83]
    ),
    'Man United': fillSquad(
      ['Eric Cantona', 'Peter Schmeichel', 'Roy Keane', 'Ryan Giggs', 'David Beckham', 'Paul Scholes', 'Gary Neville', 'Jaap Stam', 'Andy Cole', 'Teddy Sheringham', 'Ole Gunnar Solskjær', 'Denis Irwin', 'Phil Neville', 'Nicky Butt', 'Ronny Johnsen', 'Henning Berg', 'Jesper Blomqvist', 'Dwight Yorke', 'Mark Hughes', 'Steve Bruce', 'Brian McClair', 'Paul Ince', 'Lee Sharpe', 'Raimond van der Gouw'],
      [['ST', 'CAM'], ['GK'], ['CDM', 'CM'], ['LM', 'LW'], ['RM', 'RW'], ['CM', 'CAM'], ['RB'], ['CB'], ['ST'], ['ST', 'CAM'], ['ST'], ['LB'], ['RB', 'LB'], ['CM', 'CDM'], ['CB'], ['CB'], ['LM'], ['ST'], ['ST'], ['CB'], ['ST', 'CAM'], ['CM', 'CDM'], ['LM'], ['GK']],
      [93, 95, 92, 91, 90, 91, 88, 92, 90, 89, 88, 88, 87, 87, 86, 86, 85, 90, 85, 85, 84, 86, 84, 80]
    )
  },
  '2000s': {
    'Barcelona': fillSquad(
      ['Ronaldinho', 'Lionel Messi', 'Xavi', 'Carles Puyol', 'Andrés Iniesta', 'Dani Alves', 'Victor Valdés', 'Deco', 'Thierry Henry', 'Rafael Márquez', 'Giovanni van Bronckhorst', 'Samuel Eto\'o', 'Gerard Piqué', 'Yaya Touré', 'Eric Abidal', 'Pedro', 'Bojan Krkić', 'Sylvinho', 'Mark van Bommel', 'Henrik Larsson', 'Ludovic Giuly', 'Edmílson', 'Gianluca Zambrotta', 'Albert Jorquera'],
      [['CAM', 'LW', 'RW'], ['RW', 'CAM', 'ST'], ['CM'], ['CB', 'RB'], ['CM', 'CAM', 'LW'], ['RB'], ['GK'], ['CM', 'CAM'], ['LW', 'ST'], ['CB', 'CDM'], ['LB'], ['ST'], ['CB'], ['CDM'], ['LB'], ['LW', 'RW'], ['ST'], ['LB'], ['CM'], ['ST'], ['RW'], ['CB', 'CDM'], ['RB', 'LB'], ['GK']],
      [97, 95, 94, 93, 92, 93, 89, 91, 92, 89, 88, 93, 88, 89, 87, 87, 86, 86, 86, 86, 85, 85, 85, 80]
    ),
    'Chelsea': fillSquad(
        ['Frank Lampard', 'John Terry', 'Didier Drogba', 'Petr Čech', 'Claude Makélélé', 'Ashley Cole', 'Michael Essien', 'Joe Cole', 'Ricardo Carvalho', 'Michael Ballack', 'Andriy Shevchenko', 'Arjen Robben', 'Hernán Crespo', 'Paulo Ferreira', 'Wayne Bridge', 'Carlo Cudicini', 'Geremi', 'Glen Johnson', 'William Gallas', 'Damien Duff', 'Tiago', 'Salomon Kalou', 'Juliano Belletti', 'Alex'],
        [['CAM', 'CM'], ['CB'], ['ST'], ['GK'], ['CDM'], ['LB'], ['CDM', 'CM'], ['CAM', 'RW'], ['CB'], ['CM'], ['ST'], ['RW', 'LW'], ['ST'], ['RB'], ['LB'], ['GK'], ['RB', 'RM'], ['RB'], ['CB', 'LB'], ['LW'], ['CM'], ['ST', 'LW'], ['RB'], ['CB']],
        [94, 93, 92, 93, 92, 91, 90, 88, 91, 90, 88, 90, 89, 87, 86, 85, 85, 84, 84, 88, 87, 92, 86, 84]
    ),
    'Man United': fillSquad(
      ['Cristiano Ronaldo', 'Wayne Rooney', 'Paul Scholes', 'Rio Ferdinand', 'Nemanja Vidić', 'Edwin van der Sar', 'Ryan Giggs', 'Ruud van Nistelrooy', 'Michael Carrick', 'Patrice Evra', 'Gary Neville', 'Park Ji-sung', 'Darren Fletcher', 'Carlos Tevez', 'Louis Saha', 'Wes Brown', 'John O\'Shea', 'Tomasz Kuszczak', 'Owen Hargreaves', 'Nani', 'Anderson', 'Mikaël Silvestre', 'Alan Smith', 'Kieran Richardson'],
      [['ST', 'LW'], ['ST', 'CAM'], ['CM'], ['CB'], ['CB'], ['GK'], ['LM', 'LW'], ['ST'], ['CDM', 'CM'], ['LB'], ['RB'], ['LM', 'RM'], ['CM'], ['ST'], ['ST'], ['CB', 'RB'], ['RB', 'LB', 'CDM'], ['GK'], ['CDM'], ['RW'], ['CAM'], ['CB', 'LB'], ['ST', 'CDM'], ['LM']],
      [94, 91, 92, 92, 91, 93, 90, 92, 89, 90, 88, 87, 86, 90, 86, 85, 85, 82, 86, 87, 85, 84, 84, 80]
    )
  },
  '2010s': {
    'Real Madrid': fillSquad(
      ['Cristiano Ronaldo', 'Luka Modrić', 'Sergio Ramos', 'Karim Benzema', 'Toni Kroos', 'Marcelo', 'Casemiro', 'Keylor Navas', 'Dani Carvajal', 'Gareth Bale', 'Pepe', 'Isco', 'Raphaël Varane', 'Angel Di Maria', 'Iker Casillas', 'Fabio Coentrão', 'Xabi Alonso', 'Mateo Kovačić', 'Lucas Vázquez', 'Nacho', 'Alvaro Morata', 'Asier Illarramendi', 'James Rodríguez', 'Kiko Casilla'],
      [['ST', 'LW'], ['CM', 'CAM'], ['CB'], ['ST'], ['CM', 'CDM'], ['LB'], ['CDM'], ['GK'], ['RB'], ['RW', 'ST'], ['CB'], ['CAM', 'CM'], ['CB'], ['RW', 'CM'], ['GK'], ['LB'], ['CDM'], ['CM'], ['RW', 'RB'], ['CB', 'RB', 'LB'], ['ST'], ['CDM'], ['CAM'], ['GK']],
      [99, 98, 97, 95, 96, 94, 93, 93, 91, 94, 91, 89, 90, 90, 90, 86, 91, 87, 85, 86, 86, 84, 90, 83]
    ),
    'Barcelona': fillSquad(
      ['Lionel Messi', 'Andrés Iniesta', 'Xavi', 'Luis Suárez', 'Jordi Alba', 'Gerard Piqué', 'Sergio Busquets', 'Dani Alves', 'Marc-André ter Stegen', 'Neymar Jr', 'Ivan Rakitic', 'Cesc Fàbregas', 'Pedro', 'Javier Mascherano', 'Alexis Sánchez', 'Claudio Bravo', 'Sergi Roberto', 'Samuel Umtiti', 'Arthur', 'Philippe Coutinho', 'Ousmane Dembélé', 'Arturo Vidal', 'Nelson Semedo', 'Jasper Cillessen'],
      [['RW', 'CAM', 'ST'], ['CM', 'CAM', 'LW'], ['CM'], ['ST'], ['LB'], ['CB'], ['CDM'], ['RB'], ['GK'], ['LW', 'ST'], ['CM'], ['CAM', 'CM'], ['LW', 'RW'], ['CB', 'CDM'], ['RW', 'LW'], ['GK'], ['RB', 'CM'], ['CB'], ['CM'], ['CAM', 'LW'], ['RW', 'LW'], ['CM', 'CDM'], ['RB'], ['GK']],
      [99, 97, 96, 95, 91, 93, 94, 93, 91, 93, 90, 89, 88, 88, 89, 87, 87, 87, 86, 87, 87, 88, 86, 85]
    )
  },
  '2020s': {
    'Man City': fillSquad(
      ['Erling Haaland', 'Kevin De Bruyne', 'Rodri', 'Ruben Dias', 'Ederson', 'Bernardo Silva', 'Phil Foden', 'John Stones', 'Kyle Walker', 'Ilkay Gündoğan', 'Jack Grealish', 'Riyad Mahrez', 'Manuel Akanji', 'Nathan Aké', 'Aymeric Laporte', 'João Cancelo', 'Julian Alvarez', 'Oleksandr Zinchenko', 'Ferran Torres', 'Gabriel Jesus', 'Stefan Ortega', 'Rico Lewis', 'Oscar Bobb', 'Matheus Nunes'],
      [['ST'], ['CAM', 'CM'], ['CDM'], ['CB'], ['GK'], ['CAM', 'RW'], ['CAM', 'LW', 'RW'], ['CB', 'CDM'], ['RB'], ['CM'], ['LW'], ['RW'], ['CB'], ['CB', 'LB'], ['CB'], ['LB', 'RB'], ['ST'], ['LB'], ['RW', 'ST'], ['ST'], ['GK'], ['RB'], ['RW'], ['CM']],
      [97, 97, 96, 93, 92, 94, 93, 91, 90, 90, 88, 88, 88, 87, 87, 87, 87, 85, 85, 85, 84, 84, 82, 82]
    )
  }
};

const flattenSquads = (): Player[] => {
  return Object.entries(SQUADS).flatMap(([decade, clubs]) => 
    Object.entries(clubs).flatMap(([club, squadData]) => 
      squadData.names.map((name, i) => ({
        id: `${decade}-${club}-${i}`,
        name: name,
        club: club,
        decade: decade as any,
        positions: squadData.positions[i] as any,
        rating: squadData.ratings[i]
      }))
    )
  );
};

export const PLAYERS: Player[] = flattenSquads();
export const CLUBS = Array.from(new Set(PLAYERS.map(p => p.club)));
export const DECADES: string[] = ['1990s', '2000s', '2010s', '2020s'];
