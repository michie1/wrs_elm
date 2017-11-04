module Page.Result.View.Add exposing (render)

import Html exposing (Html, button, div, text, span, label, input, ul, li, h2, input, i, p)
import Html.Attributes exposing (autofocus, class, id, type_, for, disabled, value, name, checked)
import Html.Events exposing (onInput, onClick, on)
import Json.Decode as Json
import Ui.Chooser
import Set
import App.Msg
import Data.Outfit as Outfit exposing (Outfit)
import Data.Race exposing (Race)
import Data.Rider exposing (Rider)
import Data.ResultCategory as ResultCategory exposing (ResultCategory)
import Data.RaceResult exposing (RaceResult)
import Page.Result.Model


riderNameExists : String -> List Rider -> Bool
riderNameExists name riders =
    List.length (List.filter (\rider -> rider.name == name) riders) > 0



--resultExists : Int -> Int -> List RaceResult -> Bool
--resultExists raceId riderId results =
--True


render : Race -> Page.Result.Model.Add -> List Rider -> Maybe (List RaceResult) -> Html App.Msg.Msg
render race resultAdd riders maybeResults =
    let
        results =
            Maybe.withDefault [] maybeResults

        submitDisabled =
            --not (riderNameExists resultAdd.riderName riders)
            -- ||
            String.isEmpty resultAdd.result

        filteredRiders =
            List.filter
                (\rider -> not <| resultExists rider race results)
                riders

        items : List Ui.Chooser.Item
        items =
            List.map
                (\rider ->
                    { id = rider.key
                    , label = rider.name
                    , value = rider.key
                    }
                )
                filteredRiders

        chooser =
            resultAdd.chooser
                |> Ui.Chooser.items items
    in
        case maybeResults of
            Nothing ->
                div [] [ text "Results not loaded yet" ]

            Just results ->
                div []
                    [ h2 [] [ text ("Add result for " ++ race.name) ]
                    , div [ class "row" ]
                        [ div [ class "input-field col s6" ]
                            [ input
                                [ id "result"
                                , type_ "text"
                                , onInput App.Msg.ResultAddResult
                                , autofocus True
                                ]
                                []
                            , label [ for "result" ] [ text "Result" ]
                            ]
                        ]
                    , div [ class "row" ]
                        [ div [ class "input-field col s6" ]
                            [ div [] [ Html.map App.Msg.Chooser (Ui.Chooser.view chooser) ]
                            , label [ for "rider", class "active" ] [ text "Rider" ]
                            ]
                        ]
                    , div [ class "row" ] [ resultCategoryButtons ]
                    , div [ class "row" ] [ outfitButtons ]
                    , div [ class "row" ]
                        [ button
                            [ class "waves-effect waves-light btn"
                            , type_ "submit"
                            , onClick App.Msg.ResultAddSubmit
                            , Html.Attributes.name "action"
                            , disabled submitDisabled
                            ]
                            [ text "Add result"
                            , i [ class "material-icons right" ] [ text "send" ]
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


resultCategoryButtonCheck : String -> String -> ResultCategory -> Bool -> Html App.Msg.Msg
resultCategoryButtonCheck resultCategoryName resultCategoryText category isChecked =
    p []
        [ input [ checked isChecked, name "resultCategory", type_ "radio", id resultCategoryName, onClick (App.Msg.ResultAddCategory category) ] []
        , label [ for resultCategoryName ] [ text resultCategoryText ]
        ]


resultCategoryButton : String -> String -> ResultCategory -> Html App.Msg.Msg
resultCategoryButton resultCategoryName resultCategoryText resultCategory =
    resultCategoryButtonCheck resultCategoryName resultCategoryText resultCategory False


resultCategoryButtons : Html App.Msg.Msg
resultCategoryButtons =
    div []
        [ label [ for "result" ] [ text "Category" ]
        , resultCategoryButtonCheck "amateurs" "Amateurs" ResultCategory.Amateurs True
        , resultCategoryButton "basislidmaatschap" "Basislidmaatschap" ResultCategory.Basislidmaatschap
        , resultCategoryButton "cata" "Cat A" ResultCategory.CatA
        , resultCategoryButton "catb" "Cat B" ResultCategory.CatB
        ]

outfitButton : String -> String -> Outfit -> Bool -> Html App.Msg.Msg
outfitButton outfitName outfitLabel outfit isChecked =
    p []
        [ input [ checked isChecked, name "outfit", type_ "radio", id outfitName, onClick (App.Msg.ResultAddOutfit outfit) ] []
        , label [ for outfitName ] [ text outfitLabel ]
        ]

outfitButtons : Html App.Msg.Msg
outfitButtons =
    div []
        [ label [ for "result" ] [ text "Outfit" ]
        , outfitButton "wtos" "WTOS" Outfit.WTOS True
        , outfitButton "wasp" "WASP" Outfit.WASP False
        , outfitButton "other" "Other" Outfit.Other False
        ]
