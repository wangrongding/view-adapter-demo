import postcss from 'postcss'
import plugin from './postcss-view-adapter.mjs'

const run = async (input, opts, from) => {
  const result = await postcss([plugin(opts)]).process(input, { from })
  return result.css
}

const test = async () => {
  console.log('Running tests...')

  const css = '.foo { width: 100px; }'
  const expectedTransformed = '.foo { width: calc(100 * var(--unit)); }'
  const expectedOriginal = css

  // Test 1: No options (should transform)
  let output = await run(css, {}, 'test.css')
  if (!output.includes('calc(100 * var(--unit))')) {
    console.error('Test 1 Failed: Should transform by default')
  } else {
    console.log('Test 1 Passed')
  }

  // Test 2: Exclude string match
  output = await run(css, { exclude: 'exclude' }, 'exclude.css')
  if (output !== css) {
    console.error('Test 2 Failed: Should be excluded by string')
  } else {
    console.log('Test 2 Passed')
  }

  // Test 3: Exclude regex match
  output = await run(css, { exclude: /exclude/ }, 'exclude.css')
  if (output !== css) {
    console.error('Test 3 Failed: Should be excluded by regex')
  } else {
    console.log('Test 3 Passed')
  }

  // Test 4: Exclude array match
  output = await run(css, { exclude: ['foo', 'exclude'] }, 'exclude.css')
  if (output !== css) {
    console.error('Test 4 Failed: Should be excluded by array')
  } else {
    console.log('Test 4 Passed')
  }

  // Test 5: Include string match (should transform)
  output = await run(css, { include: 'include' }, 'include.css')
  if (!output.includes('calc(100 * var(--unit))')) {
    console.error('Test 5 Failed: Should be included by string')
  } else {
    console.log('Test 5 Passed')
  }

  // Test 6: Include string match (mismatch, should NOT transform)
  output = await run(css, { include: 'other' }, 'include.css')
  if (output !== css) {
    console.error('Test 6 Failed: Should not be included (mismatch)')
  } else {
    console.log('Test 6 Passed')
  }

  // Test 7: Include regex match
  output = await run(css, { include: /include/ }, 'include.css')
  if (!output.includes('calc(100 * var(--unit))')) {
    console.error('Test 7 Failed: Should be included by regex')
  } else {
    console.log('Test 7 Passed')
  }

  // Test 8: Include array match
  output = await run(css, { include: ['other', 'include'] }, 'include.css')
  if (!output.includes('calc(100 * var(--unit))')) {
    console.error('Test 8 Failed: Should be included by array')
  } else {
    console.log('Test 8 Passed')
  }

  // Test 9: Include and Exclude (Exclude takes precedence?)
  // Logic: if exclude matches, return false.
  output = await run(css, { include: 'test', exclude: 'test' }, 'test.css')
  if (output !== css) {
    console.error('Test 9 Failed: Exclude should take precedence')
  } else {
    console.log('Test 9 Passed')
  }

  console.log('Tests finished.')
}

test()
