import { library } from '@jubstaaa/config/eslint/library'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    globalIgnores(['site/**']),
    ...library({ tsconfigRootDir: import.meta.dirname }),
])
