module Page.Result.Edit.View exposing (view)

import Component.SubmitButton
import Component.TextInput
import Data.ResultCategory exposing (ResultCategory, categoryReadable, categoryToString, resultCategories)
import Html exposing (Html, button, div, h2, i, input, label, p, span, text)
import Html.Attributes exposing (autofocus, checked, class, disabled, for, id, name, type_, value)
import Html.Events exposing (onClick, onInput)
import Page.Result.Edit.Model exposing (Model)
import Page.Result.Edit.Msg as Msg exposing (Msg)


view : Model -> Html Msg
view resultEdit =
    let
        submitDisabled =
            String.isEmpty resultEdit.result

        -- Check if result exists
    in
    div []
        [ h2 [ class "title is-2" ] [ text "Edit result" ]
        , Component.TextInput.view
            { id = "result"
            , label = "Result"
            , value = resultEdit.result
            , onInput = Msg.Result
            , autofocus = True
            , icon = Just "fa fa-trophy"
            , isHorizontal = True
            }
        , div [ class "field is-horizontal" ]
            [ div [ class "field-label" ]
                [ label [ class "label", for "result" ] [ text "Category" ]
                ]
            , div [ class "field-body" ]
                [ div [ class "field" ]
                    [ p [ class "control" ] [ resultCategoryButtons resultEdit.category ]
                    ]
                ]
            ]
        , div [ class "field is-horizontal" ]
            [ div [ class "field-label" ] []
            , div [ class "field-body" ]
                [ div [ class "field" ]
                    [ p [ class "control" ]
                        [ Component.SubmitButton.view
                            { text = "Edit result"
                            , onClick = Msg.Submit
                            , isDisabled = submitDisabled
                            , name = Just "action"
                            }
                        ]
                    ]
                ]
            ]
        ]


resultCategoryButton : ResultCategory -> ResultCategory -> Html Msg
resultCategoryButton category current =
    let
        isChecked =
            category == current

        resultCategoryName =
            categoryToString category

        resultCategoryText =
            categoryReadable category
    in
    label [ class "radio", for resultCategoryName ]
        [ input [ checked isChecked, name "resultCategory", type_ "radio", id resultCategoryName, onClick (Msg.Category category) ] []
        , span [] [ text resultCategoryText ]
        ]


resultCategoryButtons : ResultCategory -> Html Msg
resultCategoryButtons current =
    div [] <|
        List.map (\resultCategory -> resultCategoryButton resultCategory current) resultCategories
