import { Html } from '@react-three/drei'

type Category = 'backend' | 'frontend' | 'db' | 'devops' | 'methodology'

interface Skill {
  name: string
  category: Category
  /** devicon slug, e.g. "java/java-original" — rendered via jsdelivr. Omit for skills with no logo (e.g. Agile/Scrum). */
  icon?: string
}

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons'

const CATEGORY_STYLE: Record<Category, { bg: string; color: string }> = {
  backend: { bg: '#dbeafe', color: '#1e3a8a' },
  frontend: { bg: '#fce7f3', color: '#9d174d' },
  db: { bg: '#ede9fe', color: '#5b21b6' },
  devops: { bg: '#dcfce7', color: '#166534' },
  methodology: { bg: '#fef9c3', color: '#854d0e' },
}

const SKILLS: Skill[] = [
  { name: 'Java', category: 'backend', icon: 'java/java-original' },
  { name: 'Spring Boot', category: 'backend', icon: 'spring/spring-original' },
  { name: 'Python', category: 'backend', icon: 'python/python-original' },
  { name: 'Django', category: 'backend', icon: 'django/django-plain' },
  { name: 'Flask', category: 'backend', icon: 'flask/flask-original' },
  { name: 'FastAPI', category: 'backend', icon: 'fastapi/fastapi-original' },
  { name: 'Node.js', category: 'backend', icon: 'nodejs/nodejs-original' },
  { name: 'Express.js', category: 'backend', icon: 'express/express-original' },
  { name: 'HTML5', category: 'frontend', icon: 'html5/html5-original' },
  { name: 'CSS3', category: 'frontend', icon: 'css3/css3-original' },
  { name: 'JavaScript', category: 'frontend', icon: 'javascript/javascript-original' },
  { name: 'TypeScript', category: 'frontend', icon: 'typescript/typescript-original' },
  { name: 'Angular', category: 'frontend', icon: 'angularjs/angularjs-original' },
  { name: 'React', category: 'frontend', icon: 'react/react-original' },
  { name: 'React Native', category: 'frontend', icon: 'react/react-original' },
  { name: 'MongoDB', category: 'db', icon: 'mongodb/mongodb-original' },
  { name: 'MySQL', category: 'db', icon: 'mysql/mysql-original' },
  { name: 'PostgreSQL', category: 'db', icon: 'postgresql/postgresql-original' },
  { name: 'Git y GitHub', category: 'devops', icon: 'git/git-original' },
  { name: 'Docker', category: 'devops', icon: 'docker/docker-original' },
  { name: 'Google Cloud', category: 'devops', icon: 'googlecloud/googlecloud-original' },
  { name: 'Figma', category: 'methodology', icon: 'figma/figma-original' },
  { name: 'Agile/Scrum', category: 'methodology' },
  { name: 'Jira', category: 'methodology', icon: 'jira/jira-original' },
]

// Fill the main letter keys left-to-right, top-to-bottom (QWERTY → ASDF →
// ZXCV) with our skills in order — whatever letters are left over just show
// their plain letter, same as a real keyboard.
const LETTER_SEQUENCE = [
  'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
  'Z', 'X', 'C', 'V', 'B', 'N', 'M',
]
const SKILL_BY_LETTER: Record<string, Skill> = {}
SKILLS.forEach((skill, i) => {
  if (i < LETTER_SEQUENCE.length) SKILL_BY_LETTER[LETTER_SEQUENCE[i]] = skill
})

interface KeyCell {
  label: string
  units?: number
  /** true for the 26 letter keys — eligible to carry a skill icon */
  letter?: boolean
}

const key = (label: string, units?: number, letter?: boolean): KeyCell => ({ label, units, letter })

const ROWS: KeyCell[][] = [
  [
    key('Esc'), key('1'), key('2'), key('3'), key('4'), key('5'), key('6'),
    key('7'), key('8'), key('9'), key('0'), key('-'), key('='), key('⌫', 2),
  ],
  [
    key('Tab', 1.5),
    ...['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((l) => key(l, 1, true)),
    key('['), key(']'), key('\\'),
  ],
  [
    key('Caps', 1.75),
    ...['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((l) => key(l, 1, true)),
    key(';'), key("'"), key('Enter', 2.25),
  ],
  [
    key('Shift', 2.25),
    ...['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((l) => key(l, 1, true)),
    key(','), key('.'), key('/'), key('Shift', 2.75),
  ],
  [
    key('Ctrl', 1.25), key('Win', 1.25), key('Alt', 1.25), key('', 6.25),
    key('Alt', 1.25), key('Fn', 1.25), key('Ctrl', 1.25),
  ],
]

const UNIT = 35
const GAP = 5

interface KeyboardScreenProps {
  onClose: () => void
}

/**
 * A full 2D "fake keyboard" — every key of a real QWERTY layout redrawn,
 * with the lettered keys carrying the matching skill logo — that sits
 * directly on top of the real 3D keyboard once zoomed in, like a prop/overlay
 * replacing it rather than a panel floating beside it.
 */
export default function KeyboardScreen({ onClose }: KeyboardScreenProps) {
  return (
    <group position={[0, 0.03, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
      <Html transform occlude={false} distanceFactor={0.55} style={{ pointerEvents: 'auto' }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            display: 'inline-block',
            background: '#b6aecb',
            borderRadius: '8px',
            padding: '7px',
            boxShadow: '0 10px 28px rgba(0,0,0,0.35), inset 0 2px 6px rgba(0,0,0,0.25)',
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            aria-label="Cerrar"
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              width: '18px',
              height: '18px',
              lineHeight: '17px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(40,30,25,0.6)',
              color: '#fff',
              fontSize: '9px',
              cursor: 'pointer',
              padding: 0,
              zIndex: 1,
            }}
          >
            ✕
          </button>

          {ROWS.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', gap: `${GAP}px`, marginBottom: `${GAP}px` }}>
              {row.map((cell, cellIndex) => {
                const skill = cell.letter ? SKILL_BY_LETTER[cell.label] : undefined
                const width = (cell.units ?? 1) * UNIT + ((cell.units ?? 1) - 1) * GAP
                const catStyle = skill ? CATEGORY_STYLE[skill.category] : null
                const baseBg = catStyle ? catStyle.bg : '#f3efe4'
                return (
                  <div
                    key={cellIndex}
                    title={skill ? skill.name : cell.label}
                    style={{
                      width: `${width}px`,
                      height: `${UNIT}px`,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0) 40%), ${baseBg}`,
                      border: '1px solid rgba(255,255,255,0.8)',
                      borderBottom: '1px solid rgba(0,0,0,0.25)',
                      borderRadius: '4px',
                      boxShadow:
                        'inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -4px 2px -2px rgba(0,0,0,0.22), 0 4px 3px -1px rgba(0,0,0,0.35)',
                      overflow: 'hidden',
                    }}
                  >
                    {skill ? (
                      skill.icon ? (
                        <img
                          src={`${DEVICON_BASE}/${skill.icon}.svg`}
                          alt={skill.name}
                          style={{ width: '23px', height: '23px' }}
                        />
                      ) : (
                        <span style={{ fontSize: '17px', lineHeight: 1 }}>🔄</span>
                      )
                    ) : (
                      <span
                        style={{
                          fontSize: cell.label.length > 2 ? '9.5px' : '12.5px',
                          fontFamily: '"Courier New", monospace',
                          fontWeight: 700,
                          color: '#8a8094',
                        }}
                      >
                        {cell.label}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </Html>
    </group>
  )
}
