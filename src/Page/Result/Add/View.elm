module Page.Result.Add.View exposing (view)

import Data.Outfit as Outfit exposing (Outfit)
import Data.Race exposing (Race)
import Data.RaceResult exposing (RaceResult)
import Data.ResultCategory exposing (ResultCategory, categoryReadable, categoryToString, resultCategories)
import Data.Rider exposing (Rider)
import Html exposing (Html, button, div, h2, i, input, label, option, p, select, span, text)
import Html.Attributes exposing (autofocus, checked, class, disabled, for, id, name, type_, value)
import Html.Events exposing (onClick, onInput)
import Page.Result.Add.Model exposing (Model)
import Page.Result.Add.Msg as Msg exposing (Msg)


view : Race -> Model -> List Rider -> List RaceResult -> Html Msg
view race resultAdd riders results =
    let
        submitDisabled =
            --not (riderNameExists resultAdd.riderName riders)
            -- ||
            String.isEmpty resultAdd.result
                || resultAdd.riderKey
                == Nothing

        filteredRiders =
            List.filter
                (\rider -> not <| resultExists rider race results)
                riders

        items =
            List.map
                (\rider ->
                    { text = rider.name
                    , value = rider.key
                    }
                )
                filteredRiders
    in
    div []
        [ h2 [ class "title is-2" ] [ text ("Add result for " ++ race.name) ]
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
                            ]
                            []
                        , span [ class "icon is-small is-left" ] [ i [ class "fa fa-trophy" ] [] ]
                        ]
                    ]
                ]
            ]
        , div [ class "field is-horizontal" ]
            [ div [ class "field-label" ]
                [ label [ class "label", for "result" ] [ text "Rider" ]
                ]
            , div [ class "field-body" ]
                [ div [ class "field" ]
                    [ div [ class "control" ]
                        [ div [ class "select" ]
                            [ select [ onInput Msg.Rider ]
                                (option [] [] :: List.map (\item -> option [ value item.value ] [ text item.text ]) items)
                            ]
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
                    [ p [ class "control" ] [ resultCategoryButtons resultAdd.category ]
                    ]
                ]
            ]
        , div [ class "field is-horizontal" ]
            [ div [ class "field-label" ]
                [ label [ class "label", for "result" ] [ text "Outfit" ]
                ]
            , div [ class "field-body" ]
                [ div [ class "field" ]
                    [ p [ class "control" ] [ outfitButtons ]
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
                            [ text "Add result" ]
                        ]
                    ]
                ]
            ]
        ]


resultExists : Rider -> Race -> List RaceResult -> Bool
resultExists rider race results =
    List.length
        (List.filter
            (\result -> race.key == result.raceKey && rider.key == result.riderKey)
            results
        )
        == 1


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


outfitButton : String -> String -> Outfit -> Bool -> Html Msg
outfitButton outfitName outfitLabel outfit isChecked =
    p []
        [ input [ checked isChecked, name "outfit", type_ "radio", id outfitName, onClick (Msg.Outfit outfit) ] []
        , label [ for outfitName ] [ text outfitLabel ]
        ]


outfitButtons : Html Msg
outfitButtons =
    div []
        [ outfitButton "wtos" "WTOS" Outfit.WTOS True
        , outfitButton "wasp" "WASP" Outfit.WASP False
        , outfitButton "other" "Other" Outfit.Other False
        ]
