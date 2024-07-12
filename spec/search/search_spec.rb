require_relative 'sphinx_helper'

feature 'Search', %q{
  In order to find information
  As user
  I want to search info about documents(tamplates)
} do
  given!(:user) { create(:user, email: 'search_test@mail.ru') }
  given!(:question) { create(:question, title: 'search question') }
  given!(:answer) { create(:answer, question: question, body: 'search answer') }
  given!(:comment_for_question) { create(:comment, commentable: question, text: 'search question comment') }
  given!(:comment_for_answer) { create(:comment, commentable: answer, text: 'search answer comment') }

  context 'Users' do
    scenario 'can view search form' do
      visit questions_path

      expect(page).to have_selector("input[name='search[query]']")
      expect(page).to have_selector("select[name='search[resource]']")
    end

    scenario 'can view results page', js: true do
      ThinkingSphinx::Test.run do
        ThinkingSphinx::Test.index
        visit questions_path
        fill_in 'search_query', with: 'no in the database'
        click_on 'Search'

        expect(page).to have_content 'No results'
      end
    end

    scenario 'can search from questions', js: true do
      ThinkingSphinx::Test.run do
        ThinkingSphinx::Test.index
          visit questions_path
          fill_in 'search_query', with: 'search question'
          select 'Question', from: 'search_resource'
          click_on 'Search'

          within '.results' do
            expect(page).to have_link question.title
            expect(page).to_not have_link answer.body
          end
      end
    end

    scenario 'can search from answers', js: true do
      ThinkingSphinx::Test.run do
        ThinkingSphinx::Test.index
          visit questions_path
          fill_in 'search_query', with: 'search answer'
          select 'Answer', from: 'search_resource'
          click_on 'Search'

        within '.results' do
          expect(page).to_not have_link question.title
          expect(page).to have_link answer.body
        end
      end
    end

    scenario 'can search answer comments', js: true do
      ThinkingSphinx::Test.run do
        ThinkingSphinx::Test.index
        visit questions_path
        fill_in 'search_query', with: 'search answer comment'
        select 'Comment', from: 'search_resource'
        click_on 'Search'

        within '.results' do
          expect(page).to have_link comment_for_answer.text
        end
      end
    end

    scenario 'can search question comments', js: true do
      ThinkingSphinx::Test.run do
        ThinkingSphinx::Test.index
        visit questions_path
        fill_in 'search_query', with: 'search question comment'
        select 'Comment', from: 'search_resource'
        click_on 'Search'

        within '.results' do
          expect(page).to have_link comment_for_question.text
        end
      end
    end

    scenario 'can search users', js: true do
      ThinkingSphinx::Test.run do
        ThinkingSphinx::Test.index
        visit questions_path
        fill_in 'search_query', with: 'search_test'
        select 'User', from: 'search_resource'
        click_on 'Search'

        within '.results' do
          expect(page).to have_content user.email
          expect(page).to_not have_link question.title
          expect(page).to_not have_link answer.body
        end
      end
    end
  end
end
