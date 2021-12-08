describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Mr Cypress',
      username: 'cypress',
      password: 'sserpyc'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('cypress')
      cy.get('#password').type('sserpyc')
      cy.contains('login').click()

      cy.contains('Mr Cypress logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('cypress')
      cy.get('#password').type('asdasd')
      cy.contains('login').click()

      cy.contains('wrong username or password')
      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Mr Cypress logged-in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'cypress', password: 'sserpyc' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Blog Title')
      cy.get('#author').type('Mr Cypress')
      cy.get('#url').type('https://fullstackopen.com/en/part5/end_to_end_testing#failed-login-test')
      cy.get('#create-blog').click()

      cy.contains('Blog Title')
      cy.contains('view')
    })

    describe('when blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'first title', author: 'first author', url: 'first url' })
        cy.createBlog({ title: 'second title', author: 'second author', url: 'second url' })
        cy.createBlog({ title: 'third title', author: 'third author', url: 'third url' })
      })

      it('a blog can be liked', function () {
        cy.contains('view').click()
        cy.contains('likes 0')
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('a blog can be deleted by the creator', function () {
        cy.contains('first title').parent().find('button').click()
        cy.get('html').should('contain', 'first title')
        cy.contains('remove').click()
        cy.get('html').should('not.contain', 'first title')
      })
    })
  })

})
