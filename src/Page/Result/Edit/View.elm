module Page.Result.Edit.View exposing (view)

import Data.Outfit as Outfit exposing (Outfit)
import Data.Race exposing (Race)
import Data.RaceResult exposing (RaceResult)
import Data.ResultCategory exposing (ResultCategory, categoryReadable, categoryToString, resultCategories)
import Data.Rider exposing (Rider)
import Html exposing (Html, button, div, h2, i, input, label, option, p, select, span, text)
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
        , div [ class "field is-horizontal" ]
            [ div [ class "field-label" ]
                [ label [ class "label", for "result" ] [ text "Result" ]
                ]
            , div [ class "field-body" ]
                [ div [ class "field" ]
                    [ p [ class "control has-icons-left" ]
                        [ input
                            [ id "result"
                            , class "input"
                            , type_ "text"
                            , onInput Msg.Result
                            , autofocus True
                            , value resultEdit.result
                            ]
                            []
                        , span [ class "icon is-small is-left" ] [ i [ class "fa fa-trophy" ] [] ]
                        ]
                    ]
                ]
            ]
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
                        [ button
                            [ class "button is-primary"
                            , type_ "submit"
                            , onClick Msg.Submit
                            , Html.Attributes.name "action"
                            , disabled submitDisabled
                            ]
                            [ text "Edit result" ]
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
    p []
        [ input [ checked isChecked, name "resultCategory", type_ "radio", id resultCategoryName, onClick (Msg.Category category) ] []
        , label [ for resultCategoryName ] [ text resultCategoryText ]
        ]


resultCategoryButtons : ResultCategory -> Html Msg
resultCategoryButtons current =
    div [] <|
        List.map (\resultCategory -> resultCategoryButton resultCategory current) resultCategories
