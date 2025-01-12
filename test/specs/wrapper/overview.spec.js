import { describeWithShallowAndMount, vueVersion } from '~resources/utils'

describeWithShallowAndMount('overview', mountingMethod => {
  const originalLog = console.log
  let consoleOutput = []
  const consoleLogMock = (...output) =>
    consoleOutput.push(...output.join(' ').split('\n'))

  beforeEach(() => {
    consoleOutput = []
    console.log = consoleLogMock
  })
  afterEach(() => (console.log = originalLog))

  it('throws error when called on non VueWrapper', () => {
    const wrapper = mountingMethod({ template: '<div><p /></div>' })
    const nonVueWrapper = wrapper.find('p')
    const message =
      '[vue-test-utils]: wrapper.overview() can only be called on a Vue instance'

    expect(() => nonVueWrapper.overview()).toThrow(message)
  })

  if (vueVersion > 2) {
    it('prints a simple overview of the Wrapper', () => {
      const wrapper = mountingMethod({
        template:
          '<div class="test" style="{ color: red }"><p>My name is {{ firstName }} {{ lastName }}</p></div>',
        data() {
          return {
            firstName: 'Tess',
            lastName: 'Ting'
          }
        },
        computed: {
          onePlusOne: () => 1 + 1
        }
      })
      wrapper.vm.$emit('foo', 'hello', 'world')
      wrapper.vm.$emit('foo', 'bye', 'world')
      wrapper.vm.$emit('bar', 'hey')

      const expectedConsoleOutput = [
        '',
        'Wrapper (Visible):',
        '',
        'Html:',
        '    <div class="test">',
        '      <p>My name is Tess Ting</p>',
        '    </div>',
        '',
        'Data: {',
        '    firstName: Tess,',
        '    lastName: Ting',
        '}',
        '',
        'Computed: {',
        '    onePlusOne: 2',
        '}',
        '',
        'Emitted: {',
        '    foo: [',
        '        0: [ hello, world ],',
        '        1: [ bye, world ]',
        '    ],',
        '    bar: [',
        '        0: [ hey ]',
        '    ]',
        '}',
        ''
      ]
      wrapper.overview()
      expect(consoleOutput).toEqual(expectedConsoleOutput)
    })

    describe('vibility', () => {
      it('prints "Visible" when the wrapper is visible', () => {
        const wrapper = mountingMethod({ template: '<div class="test"></div>' })

        const expectedConsoleOutput = [
          '',
          'Wrapper (Visible):',
          '',
          'Html:',
          '    <div class="test"></div>',
          '',
          'Data: {}',
          '',
          'Computed: {}',
          '',
          'Emitted: {}',
          ''
        ]

        wrapper.isVisible = () => true
        wrapper.overview()
        expect(consoleOutput).toEqual(expectedConsoleOutput)
      })

      it('prints "Not Visible" when the wrapper is not visible', () => {
        const wrapper = mountingMethod({ template: '<div class="test"></div>' })

        const expectedConsoleOutput = [
          '',
          'Wrapper (Not visible):',
          '',
          'Html:',
          '    <div class="test"></div>',
          '',
          'Data: {}',
          '',
          'Computed: {}',
          '',
          'Emitted: {}',
          ''
        ]

        wrapper.isVisible = () => false
        wrapper.overview()
        expect(consoleOutput).toEqual(expectedConsoleOutput)
      })
    })

    describe('html', () => {
      it('prints Html as empty when html is not defined', () => {
        const wrapper = mountingMethod({ template: '' })

        const expectedConsoleOutput = [
          '',
          'Wrapper (Visible):',
          '',
          'Html:',
          '',
          'Data: {}',
          '',
          'Computed: {}',
          '',
          'Emitted: {}',
          ''
        ]

        wrapper.overview()
        expect(consoleOutput).toEqual(expectedConsoleOutput)
      })
    })

    describe('data', () => {
      it('prints Data as {} when data is empty', () => {
        const wrapper = mountingMethod({
          template: '<div class="test" style="{ color: red }"></div>',
          computed: {
            onePlusOne: () => 1 + 1
          }
        })
        wrapper.vm.$emit('foo', 'hello', 'world')
        wrapper.vm.$emit('foo', 'bye', 'world')
        wrapper.vm.$emit('bar', 'hey')

        const expectedConsoleOutput = [
          '',
          'Wrapper (Visible):',
          '',
          'Html:',
          '    <div class="test"></div>',
          '',
          'Data: {}',
          '',
          'Computed: {',
          '    onePlusOne: 2',
          '}',
          '',
          'Emitted: {',
          '    foo: [',
          '        0: [ hello, world ],',
          '        1: [ bye, world ]',
          '    ],',
          '    bar: [',
          '        0: [ hey ]',
          '    ]',
          '}',
          ''
        ]
        wrapper.overview()
        expect(consoleOutput).toEqual(expectedConsoleOutput)
      })
    })

    describe('computed', () => {
      it('prints Computed as {} when data is empty', () => {
        const wrapper = mountingMethod({
          template: '<div class="test" style="{ color: red }"></div>'
        })
        wrapper.vm.$emit('foo', 'hello', 'world')
        wrapper.vm.$emit('foo', 'bye', 'world')
        wrapper.vm.$emit('bar', 'hey')

        const expectedConsoleOutput = [
          '',
          'Wrapper (Visible):',
          '',
          'Html:',
          '    <div class="test"></div>',
          '',
          'Data: {}',
          '',
          'Computed: {}',
          '',
          'Emitted: {',
          '    foo: [',
          '        0: [ hello, world ],',
          '        1: [ bye, world ]',
          '    ],',
          '    bar: [',
          '        0: [ hey ]',
          '    ]',
          '}',
          ''
        ]
        wrapper.overview()
        expect(consoleOutput).toEqual(expectedConsoleOutput)
      })
    })

    describe('emitted events', () => {
      it('prints Emitted as {} when no events have been emitted', () => {
        const wrapper = mountingMethod({
          template: '<div class="test" style="{ color: red }"></div>'
        })

        const expectedConsoleOutput = [
          '',
          'Wrapper (Visible):',
          '',
          'Html:',
          '    <div class="test"></div>',
          '',
          'Data: {}',
          '',
          'Computed: {}',
          '',
          'Emitted: {}',
          ''
        ]
        wrapper.overview()
        expect(consoleOutput).toEqual(expectedConsoleOutput)
      })

      it('prints an empty array in Emitted arrays of calls when emit was empty', () => {
        const wrapper = mountingMethod({
          template: '<div class="test" style="{ color: red }"></div>'
        })

        wrapper.vm.$emit('foo')
        wrapper.vm.$emit('foo')

        const expectedConsoleOutput = [
          '',
          'Wrapper (Visible):',
          '',
          'Html:',
          '    <div class="test"></div>',
          '',
          'Data: {}',
          '',
          'Computed: {}',
          '',
          'Emitted: {',
          '    foo: [',
          '        0: [  ],',
          '        1: [  ]',
          '    ]',
          '}',
          ''
        ]
        wrapper.overview()
        expect(consoleOutput).toEqual(expectedConsoleOutput)
      })

      it('prints inline formated object in Emitted arrays of calls when an object has been emitted', () => {
        const wrapper = mountingMethod({
          template: '<div class="test" style="{ color: red }"></div>'
        })

        wrapper.vm.$emit('foo', {
          title: 'How to test',
          author: 'Tester',
          price: 10
        })
        wrapper.vm.$emit(
          'foo',
          { title: 'How to test 2', author: 'Tester Jr', price: 12 },
          'New'
        )

        const expectedConsoleOutput = [
          '',
          'Wrapper (Visible):',
          '',
          'Html:',
          '    <div class="test"></div>',
          '',
          'Data: {}',
          '',
          'Computed: {}',
          '',
          'Emitted: {',
          '    foo: [',
          '        0: [ {title:How to test, author:Tester, price:10} ],',
          '        1: [ {title:How to test 2, author:Tester Jr, price:12}, New ]',
          '    ]',
          '}',
          ''
        ]
        wrapper.overview()
        expect(consoleOutput).toEqual(expectedConsoleOutput)
      })
    })

    describe('child components', () => {
      it('prints children compenents HTML', () => {
        const wrapper = mountingMethod({
          template: `<div>1<tester></tester></div>`,
          components: {
            tester: {
              template: `<div class="tester">test</div>`
            }
          }
        })

        const expectedConsoleOutput = [
          '',
          'Wrapper (Visible):',
          '',
          'Html:',
          mountingMethod.name === 'shallowMount'
            ? '    <div>1<tester-stub></tester-stub>'
            : '    <div>1<div class="tester">test</div>',
          '    </div>',
          '',
          'Data: {}',
          '',
          'Computed: {}',
          '',
          'Emitted: {}',
          ''
        ]

        wrapper.isVisible = () => true
        wrapper.overview()
        expect(consoleOutput).toEqual(expectedConsoleOutput)
      })

      it('does not print child component data or computed', () => {
        const wrapper = mountingMethod({
          template: `<div>1<tester></tester></div>`,
          data() {
            return {
              fathersMessage: 'I am your father'
            }
          },
          computed: {
            onePlusOne: () => 1 + 1
          },
          components: {
            tester: {
              template: `<div class="tester">test</div>`,
              data() {
                return {
                  something: 'hiden'
                }
              },
              computed: {
                twoPlusTwo: () => 2 + 2
              }
            }
          }
        })

        const expectedConsoleOutput = [
          '',
          'Wrapper (Visible):',
          '',
          'Html:',
          mountingMethod.name === 'shallowMount'
            ? '    <div>1<tester-stub></tester-stub>'
            : '    <div>1<div class="tester">test</div>',
          '    </div>',
          '',
          'Data: {',
          '    fathersMessage: I am your father',
          '}',
          '',
          'Computed: {',
          '    onePlusOne: 2',
          '}',
          '',
          'Emitted: {}',
          ''
        ]

        wrapper.overview()
        expect(consoleOutput).toEqual(expectedConsoleOutput)
      })
    })
  }
})
